import { ObjectId } from 'mongodb'
import express from 'express'
import axios from 'axios'
import logger from '../../utils/logger.js'
import database from '../../models/mongodb.js'
import auth from '../../middleware/auth.js'
import recaptcha from '../../middleware/recaptcha.js'
import freight from '../../middleware/freight.js'
import shipmentForm from '../../middleware/shipmentForm.js'
import { send } from '../../components/mail.js'
import activity from '../../components/activity.js'
import { GOOGLE_MAP } from '../../config.js'

const router = express.Router()
const limit = 20

/**
 * Get all Freight Shipments & search
 */
router.post('/', auth, async (req, res, next) => {
    try {
        // if (!req.user) return res.status(401).send()
        const { page, query, status, type } = req.body
        if (!page) return res.status(400).send()
        const current_page = parseInt(page) || 1
        const skip = (current_page - 1) * limit
        const isUser = !['super_admin', 'admin', 'staff'].includes(req.user.role)

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
                .find(filter)
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
        ])

        return res.status(200).json({
            data: items,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: current_page,
        })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

/**
 * Get Freight by freight id
 */
router.get('/:id', [auth, freight], (req, res) => res.status(200).json(req.freight))

/**
 * Create a Freight shipment
 */
router.post('/book', [recaptcha, auth, shipmentForm], async (req, res, next) => {
    try {
        const {
            isImport,
            isResidentialAddress,
            containsDangerGoods,
            containsDocuments,
            from,
            to,
            type,
            items,
        } = req.body

        const db = await database()
        const dateNow = Date.now()
        const trackingNumber = `${to[0].countryCode}-${Date.now().toString()}`
        await db.collection('freight').insertOne({
            user_id: req.user._id,
            is_import: isImport,
            is_residential_address: isResidentialAddress,
            contains_danger_goods: containsDangerGoods,
            contains_documents: containsDocuments,
            from: from,
            to: to,
            type: type,
            items: items,
            status: 'to_pay',
            session_id: req.session._id,
            tracking_number: trackingNumber,
            created_at: dateNow,
            updated_at: dateNow,
        })
        send(
            {
                to: req.user.email,
                subject: 'Shipment has been created',
                text: `We have arranged your shipment schedules please proceed to payment so we can processed your shipment as soon as possible.<br><br>If you need assistance feel free to contact us.`,
            },
            req.user.first_name,
        )
        activity(req, `created a shipment`)
        return res
            .status(201)
            .json({ tracking_number: trackingNumber, message: 'Shipment has been created.' })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

/**
 * Update freight details
 */
router.post('/update/:id', [recaptcha, auth, freight], async (req, res, next) => {
    try {
        const {
            _id,
            isImport,
            isResidentialAddress,
            containsDangerGoods,
            containsDocuments,
            from,
            to,
            type,
            items,
        } = req.body

        const db = await database()
        await db.collection('freight').updateOne(
            { _id: new ObjectId(_id) },
            {
                $set: {
                    isImport,
                    isResidentialAddress
                    containsDangerGoods,
                    containsDocuments,
                    from,
                    to,
                    type,
                    items,
                    updated_at: Date.now(),
                    modified_by: req.user._id,
                },
            },
        )

        activity(req, `updated a shipment information #${id}`)
        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

/**
 * Cancel a Freight shipment
 */
router.post('/cancel/:id', [recaptcha, auth, freight], async (req, res, next) => {
    try {
        const id = req.params.id
        const db = await database()
        await db.collection('freight').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    status: 'cancelled',
                    updated_at: Date.now(),
                    modified_by: req.user._id,
                },
            },
        )

        activity(req, `cancelled a shipment #${id}`)
        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
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
    res.status(500).send()
})

export default router
