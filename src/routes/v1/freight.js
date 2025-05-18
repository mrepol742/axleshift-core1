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
import InvoiceGenerator from '../../components/invoice.js'
import sendWebhook from '../../utils/webhook.js'
import XLSX from 'xlsx'

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
        return res.sendGzipped(200, data)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Deep searching in freight by different fields
 */
router.post('/deep-search', [auth, cache], async (req, res, next) => {
    try {
        const { page, endDate, startDate, status, type, weight, query, export_type } = req.body
        if (!page) return res.status(400).json({ error: 'Invalid request' })
        const current_page = parseInt(page) || 1
        const skip = (current_page - 1) * limit
        const isUser = req.user ? !['super_admin', 'admin', 'staff'].includes(req.user.role) : null

        let filter
        const deep_filter = {}
        if (query) deep_filter.tracking_number = { $regex: query, $options: 'i' }
        if (status && ['to_pay', 'to_ship', 'to_receive', 'recieved', 'cancelled'].includes(status))
            deep_filter.status = status
        if (type && ['private', 'business'].includes(type)) deep_filter.type = type
        if (weight) {
            const weightValue = parseInt(weight)
            if (weightValue === 1) deep_filter.total_weight = { $lte: 1 }
            else if (weightValue === 71) deep_filter.total_weight = { $gte: 71 }
            else deep_filter.total_weight = { $lte: weightValue }
        }
        if (startDate || endDate) {
            deep_filter.created_at = {}
            if (startDate) deep_filter.created_at.$gte = new Date(startDate).getTime()
            if (endDate) deep_filter.created_at.$lte = new Date(endDate).getTime()
        }

        filter = isUser ? { user_id: req.user._id, ...deep_filter } : { ...deep_filter }

        const db = await database()
        const freightCollection = db.collection('freight')
        const userCollection = db.collection('users')
        const paymentCollection = db.collection('invoices')

        const [totalItems, items] = await Promise.all([
            freightCollection.countDocuments(filter),
            freightCollection
                .find(filter, { projection: { from: 0, to: 0, items: 0 } })
                .sort({ created_at: -1 })
                .skip(export_type ? 0 : skip)
                .limit(export_type ? 0 : limit)
                .toArray(),
        ])

        const userIds = items.map((item) => item.user_id)
        const users = await userCollection
            .find({ _id: { $in: userIds.map((id) => new ObjectId(id)) } })
            .toArray()
        const userMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = user
            return acc
        }, {})

        const paymentIds = items.map((item) => item.invoice_id)
        const payments = await paymentCollection.find({ invoice_id: { $in: paymentIds } }).toArray()
        const paymentMap = payments.reduce((acc, payment) => {
            acc[payment.invoice_id] = payment
            return acc
        }, {})

        const enrichedItems = items.map((item) => ({
            ...item,
            user: userMap[item.user_id.toString()] || null,
            invoice: item.invoice_id ? paymentMap[item.invoice_id.toString()] || null : null,
        }))

        if (export_type) {
            const header =
                'Tracking Number, Customer, Status, Type, Amount, Payment, Date, Weight\n'
            const csvData = enrichedItems
                .map((item) => {
                    return [
                        `"${item.tracking_number}"`,
                        `"${item.user.first_name} ${item.user.last_name}"`,
                        `"${item.status}"`,
                        `"${item.type}"`,
                        `"${new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: item.amount.currency,
                        }).format(item.amount.value)}"`,
                        `"${
                            item.invoice
                                ? item.invoice.status === 'PAID'
                                    ? `${item.invoice.status} via ${item.invoice.payment_method}`
                                    : item.invoice.status
                                : 'NaN'
                        }"`,
                        `"${new Date(item.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}"`,
                        `"${item.total_weight}KG"`,
                    ].join(',')
                })
                .join('\n')
            const csvContent = header + csvData

            if (export_type === 'excel') {
                const workbook = XLSX.utils.book_new()
                const rows = csvContent.split('\n').map((row) => row.split(','))
                const worksheet = XLSX.utils.sheet_add_aoa(XLSX.utils.aoa_to_sheet([]), rows)
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

                const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
                res.setHeader(
                    'Content-Type',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                )
                res.setHeader(
                    'Content-Disposition',
                    `attachment; filename=freight_${Date.now()}.xlsx`,
                )
                res.setHeader('Content-Length', excelBuffer.length)
                res.send(excelBuffer)
            } else {
                const csvBuffer = Buffer.from(csvContent, 'utf-8')
                res.setHeader('Content-Type', 'text/csv')
                res.setHeader(
                    'Content-Disposition',
                    `attachment; filename=freight_${Date.now()}.csv`,
                )
                res.setHeader('Content-Length', csvBuffer.length)
                res.send(csvBuffer)
            }
            return
        }

        const data = {
            data: enrichedItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: current_page,
        }

        if (req.cacheKey) setCache(req.cacheKey, data, 30 * 60 * 1000)
        return res.sendGzipped(200, data)
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
                projection: {
                    tracking_number: 1,
                    created_at: 1,
                    expected_delivery_date: 1,
                    status: 1,
                    total_weight: 1,
                    number_of_items: 1,
                    type: 1,
                    amount: 1,
                    courier: 1,
                    country: 1,
                },
            })
            .sort({ created_at: -1 })
            .toArray()

        return res.sendGzipped(200, freight)
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
        const shipmentWeight = totalWeight(items)
        const numberOfItems = items.length
        const shipmentPrice = price(items)
        const country = to[0].country
        const trackingNumber = `AX-${dateNow.toString()}`
        // TODO: calculate expected delivery date
        // and draw a estimated route
        const expectedDelivery = new Date(dateNow + 3 * 24 * 60 * 60 * 1000)

        await Promise.all([
            db.collection('freight').insertOne({
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
                    currency: 'PHP',
                    value: shipmentPrice,
                },
                expected_delivery_date: expectedDelivery.getTime(),
                country: country,
                session_id: req.session._id,
                tracking_number: trackingNumber,
                selected_address: selected_address,
                created_at: dateNow,
                updated_at: dateNow,
            }),
            send(
                {
                    to: req.user.email,
                    subject: `${trackingNumber} | Shipment has been created`,
                    text: `We have arranged your shipment schedules please proceed to payment so we can processed your shipment as soon as possible.<br><br>If you need assistance feel free to contact us.`,
                },
                req.user.first_name,
            ),
            activity(req, `created a shipment`),
            sendNotification(req, {
                title: 'Shipment Created',
                message: `Shipment has been created with tracking number ${trackingNumber}.`,
            }),
        ])

        const invoice = await InvoiceGenerator(res, req, trackingNumber)
        if (!invoice) return res.status(200).json({ error: 'Unable to find shipment invoice' })
        return invoice
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

        const [freightObject, log, invoice] = await Promise.all([
            (async () => {
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
                                currency: 'PHP',
                                value: shipmentPrice,
                            },
                            expected_delivery_date: expectedDelivery.getTime(),
                            country: countryTo,
                            selected_address: selected_address,
                            updated_at: Date.now(),
                        },
                    },
                )
            })(),
            activity(req, `updated a shipment information #${id}`),
            InvoiceGenerator(res, req, id),
        ])

        return invoice
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
        const freight = await db.collection('freight').findOne({ tracking_number: id })
        if (!freight) return res.status(404).json({ error: 'Shipment not found.' })

        if (['to_receive', 'received', 'cancelled'].includes(freight.status))
            return res.status(400).json({ error: 'Shipment cannot be cancelled.' })

        await db.collection('freight').updateOne(
            { tracking_number: id },
            {
                $set: {
                    status: 'cancelled',
                    updated_at: Date.now(),
                },
            },
        )

        // TODO: dont forget to process the refund
        // procedure here
        // if the status is to_ship

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
