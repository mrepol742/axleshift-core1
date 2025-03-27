import { ObjectId } from 'mongodb'
import express from 'express'
import axios from 'axios'
import logger from '../../utils/logger.js'
import { totalWeight, price } from '../../utils/freight.js'
import database from '../../models/mongodb.js'
import auth from '../../middleware/auth.js'
import recaptcha from '../../middleware/recaptcha.js'
import freight from '../../middleware/freight.js'
import shipmentForm from '../../middleware/shipmentForm.js'
import { send } from '../../components/mail.js'
import activity, { sendNotification } from '../../components/activity.js'
import { GOOGLE_MAP } from '../../config.js'
import cache from '../../middleware/cache.js'
import { setCache } from '../../models/redis.js'

const router = express.Router()
const limit = 20

/**
 * Get all Freight Shipments & search
 */
router.post('/', [auth, cache], async (req, res, next) => {
    try {
        // if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
        const { page, query, status, type } = req.body
        if (!page) return res.status(400).json({ error: 'Invalid request' })
        const current_page = parseInt(page) || 1
        const skip = (current_page - 1) * limit
        const isUser = req.user ? !['super_admin', 'admin', 'staff'].includes(req.user.role) : null

        let filter
        if (!query) {
            filter = isUser ? { user_id: req.user._id } : {}
        } else {
            const deep_filter = {
                $or: [],
            }
            if (query) deep_filter.$or.push({ tracking_number: { $regex: query, $options: 'i' } })
            if (
                status &&
                ['to_pay', 'to_ship', 'to_receive', 'recieved', 'cancelled'].includes(status)
            )
                deep_filter.$or.push({ status: status })
            if (type && ['private', 'business'].includes(type)) deep_filter.$or.push({ type: type })

            filter = isUser ? { user_id: req.user._id, ...deep_filter } : { ...deep_filter }
        }

        const db = await database()
        const freightCollection = db.collection('freight')

        const [totalItems, items] = await Promise.all([
            freightCollection.countDocuments(filter),
            freightCollection
                .find(filter, { projection: { from: 0, to: 0, items: 0 } })
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
        ])

        const data = {
            data: items,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: current_page,
        }

        if (req.cacheKey) setCache(req.cacheKey, data, 30 * 60 * 1000)
        return res.status(200).json(data)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Get Freight schedules
 */
router.get('/calendar', auth, async (req, res) => {
    try {
        const db = await database()
        const freightCollection = db.collection('freight')
        const isUser = req.user ? !['super_admin', 'admin', 'staff'].includes(req.user.role) : null

        const filter = {
            status: { $ne: 'cancelled' },
            ...(isUser ? { user_id: req.user._id } : {}),
        }
        const freight = await freightCollection
            .find(filter, {
                projection: { tracking_number: 1, expected_delivery_date: 1, status: 1, type: 1 },
            })
            .sort({ created_at: -1 })
            .toArray()

        const events = []

        for (let i = 0; i < freight.length; i++) {
            events.push({
                title: freight[i].tracking_number,
                start: freight[i].expected_delivery_date,
                end: freight[i].expected_delivery_date,
            })
        }
        return res.status(200).json(events)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Get Freight by tracking number
 */
router.get('/:id', [auth, freight], (req, res) => res.status(200).json(req.freight))

/**
 * Create a Freight shipment
 */
router.post('/book', [recaptcha, auth, shipmentForm], async (req, res, next) => {
    try {
        const {
            is_import,
            is_residential_address,
            contains_danger_goods,
            contains_documents,
            from,
            to,
            type,
            items,
            selected_address,
        } = req.body

        const db = await database()
        const dateNow = Date.now()
        const trackingNumber = `${to[0].country_code}-${Date.now().toString()}`
        const shipmentWeight = totalWeight(items)
        const numberOfItems = items.length
        const shipmentPrice = price(items)
        const country = to[0].country
        // TODO: calculate expected delivery date
        // and draw a estimated route
        const expectedDelivery = new Date(dateNow + 3 * 24 * 60 * 60 * 1000)

        await db.collection('freight').insertOne({
            user_id: req.user._id,
            is_import: is_import,
            is_residential_address: is_residential_address,
            contains_danger_goods: contains_danger_goods,
            contains_documents: contains_documents,
            from: from,
            to: to,
            type: type,
            items: items,
            status: 'to_pay',
            courier: 'none',
            total_weight: shipmentWeight,
            number_of_items: numberOfItems,
            amount: {
                currency: 'USD',
                value: shipmentPrice,
            },
            expected_delivery_date: expectedDelivery.getTime(),
            country: country,
            session_id: req.session._id,
            tracking_number: trackingNumber,
            selected_address: selected_address,
            created_at: dateNow,
            updated_at: dateNow,
        })
        send(
            {
                to: req.user.email,
                subject: `${trackingNumber} | Shipment has been created`,
                text: `We have arranged your shipment schedules please proceed to payment so we can processed your shipment as soon as possible.<br><br>If you need assistance feel free to contact us.`,
            },
            req.user.first_name,
        )
        activity(req, `created a shipment`)
        sendNotification(req, {
            title: 'Shipment Created',
            message: `Shipment has been created with tracking number ${trackingNumber}.`,
        })
        return res
            .status(201)
            .json({ tracking_number: trackingNumber, message: 'Shipment has been created.' })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Update freight details
 */
router.post('/update/:id', [recaptcha, auth, freight, shipmentForm], async (req, res, next) => {
    try {
        const {
            is_import,
            is_residential_address,
            contains_danger_goods,
            contains_documents,
            from,
            to,
            type,
            items,
            selected_address,
        } = req.body
        const id = req.params.id

        const shipmentWeight = totalWeight(items)
        const numberOfItems = items.length
        const shipmentPrice = price(items)
        const countryTo = to[0].country
        // TODO: update courier here

        // TODO: calculate expected delivery date
        // and draw a estimated route
        let expectedDelivery = new Date(req.freight.expected_delivery_date)
        if (
            countryTo != req.freight.to[0].country ||
            from[0].country != req.freight.from[0].country
        ) {
            expectedDelivery = new Date(expectedDelivery)
            expectedDelivery.setDate(expectedDelivery.getDate() + 1)
        }
        if (from[0].city != req.freight.from[0].city || to[0].city != req.freight.to[0].city) {
            expectedDelivery = new Date(expectedDelivery)
            expectedDelivery.setHours(expectedDelivery.getHours() + 12)
        }

        const db = await database()
        await db.collection('freight').updateOne(
            { tracking_number: id },
            {
                $set: {
                    is_import: is_import,
                    is_residential_address: is_residential_address,
                    contains_danger_goods: contains_danger_goods,
                    contains_documents: contains_documents,
                    from: from,
                    to: to,
                    type: type,
                    items: items,
                    total_weight: shipmentWeight,
                    number_of_items: numberOfItems,
                    amount: {
                        currency: 'USD',
                        value: shipmentPrice,
                    },
                    expected_delivery_date: expectedDelivery.getTime(),
                    country: countryTo,
                    selected_address: selected_address,
                    updated_at: Date.now(),
                    modified_by: req.user._id,
                },
            },
        )

        activity(req, `updated a shipment information #${id}`)
        return res.status(200).json({ tracking_number: id, message: 'Shipment has been updated.' })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Cancel a Freight shipment
 */
router.post('/cancel/:id', [recaptcha, auth, freight], async (req, res, next) => {
    try {
        const id = req.params.id
        const db = await database()
        await db.collection('freight').updateOne(
            { tracking_number: id },
            {
                $set: {
                    status: 'cancelled',
                    updated_at: Date.now(),
                    modified_by: req.user._id,
                },
            },
        )

        send(
            {
                to: req.user.email,
                subject: `${id} | Shipment has been cancelled`,
                text: `We have cancelled your shipment schedules. If you have any questions or need assistance feel free to contact us.`,
            },
            req.user.first_name,
        )
        activity(req, `cancelled a shipment #${id}`)
        sendNotification(req, {
            title: 'Shipment Cancelled',
            message: `Shipment has been cancelled with tracking number ${id}.`,
        })
        return res.status(200).json({ message: 'Shipment has been cancelled.' })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

router.post('/optimized-route', [auth], async (req, res, next) => {
    try {
        const { pickup, dropoff } = req.body

        const params = {
            origin: `${pickup.lat},${pickup.lng}`,
            destination: `${dropoff.lat},${dropoff.lng}`,
            waypoints: '',
            optimize_waypoints: true,
            key: GOOGLE_MAP,
        }

        const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            params,
        })
        return res.status(200).json(response.data)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
