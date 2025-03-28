import { ObjectId } from 'mongodb'
import express from 'express'
import { Xendit } from 'xendit-node'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import auth from '../../middleware/auth.js'
import freight from '../../middleware/freight.js'
import invoices from '../../middleware/invoices.js'
import recaptcha from '../../middleware/recaptcha.js'
import { XENDIT_API_GATEWAY_URL, XENDIT_API_KEY, NODE_ENV } from '../../config.js'
import activity from '../../components/activity.js'
import cache from '../../middleware/cache.js'
import { setCache } from '../../models/redis.js'

const { Invoice } = new Xendit({
    secretKey: XENDIT_API_KEY,
    xenditURL: XENDIT_API_GATEWAY_URL,
})
const router = express.Router()
const limit = 20

/**
 * Get all Invoices
 */
router.post('/', [auth, cache], async (req, res) => {
    try {
        const { page } = req.body
        if (!page) return res.status(400).json({ error: 'Invalid request' })
        const current_page = parseInt(page) || 1
        const skip = (current_page - 1) * limit
        const isUser = req.user ? !['super_admin', 'admin', 'staff'].includes(req.user.role) : null

        const db = await database()
        const invoicesCollection = await db.collection('invoices')
        const filter = isUser ? { user_id: req.user._id } : {}

        const [totalItems, items] = await Promise.all([
            invoicesCollection.countDocuments(filter),
            invoicesCollection
                .find(filter)
                .sort({ updated_at: -1 })
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
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Get Invoice by tracking number
 */
router.get('/:id', [auth], async (req, res) => {
    const id = req.params.id
        ? /^[A-Z]{2}-\d+$/.test(req.params.id)
            ? req.params.id
            : req.body.id
        : req.body.id
    if (!id) return res.status(400).json({ error: 'Invalid request' })

    try {
        const db = await database()
        const invoicesCollection = db.collection('invoices')
        const invoice = await invoicesCollection.findOne({ freight_tracking_number: id })
        if (!invoice)
            return res
                .status(404)
                .json({ error: 'Shipment invoice not found', tracking_number: id })

        return res.status(200).json(invoice)
    } catch (err) {
        logger.error(err)
    }
    res.status(400).json({ error: 'Invalid request' })
})

/**
 * Create an Invoice
 */
router.post('/', [recaptcha, auth, freight, invoices], async (req, res) => {
    try {
        if (req.invoice)
            return res
                .status(200)
                .send({ r_url: `https://checkout-staging.xendit.co/web/${req.invoice.invoice_id}` })

        const redirectUrl =
            NODE_ENV !== 'production'
                ? `http://localhost:3000/shipment/${req.freight.tracking_number}`
                : `https://core1.axleshift.com/shipment/${req.freight.tracking_number}`
        const invoice = await Invoice.createInvoice({
            data: {
                amount: req.freight.amount.value,
                payerEmail: req.user.email,
                invoiceDuration: 172800,
                externalId: `core1-axleshift-${Date.now()}`,
                description: `Shipment #${req.freight.tracking_number}`,
                currency: req.freight.amount.currency,
                reminderTime: 1,
                shouldSendEmail: true,
                failureRedirectUrl: redirectUrl,
                successRedirectUrl: redirectUrl,
            },
        })

        const db = await database()
        const invoicesCollection = db.collection('invoices')
        const dateNow = Date.now()
        const _invoice = await invoicesCollection.insertOne({
            user_id: req.user._id,
            freight_id: req.freight._id,
            freight_tracking_number: req.freight.tracking_number,
            invoice_id: invoice.id,
            invoice_external_id: invoice.externalId,
            amount: invoice.amount,
            status: invoice.status,
            currency: invoice.currency,
            session_id: req.session._id,
            created_at: dateNow,
            updated_at: dateNow,
        })
        await db.collection('freight').updateOne(
            { _id: new ObjectId(req.freight._id) },
            {
                $set: {
                    invoice_id: _invoice._id,
                    updated_at: dateNow,
                },
            },
        )

        send(
            {
                to: req.user.email,
                subject: `${req.freight.tracking_number} | Payment Received`,
                text: `Thank you for your payment. Your shipment is now ready for processing.<br><br>If you need assistance feel free to contact us.`,
            },
            req.user.first_name,
        )
        activity(
            req,
            `create invoice for shipment #${req.freight._id} with invoice id #${_invoice._id}`,
        )
        return res.status(200).send({ r_url: invoice.invoiceUrl })
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Cancel an Invoice
 */
router.post('/cancel', [recaptcha, auth, invoices], async (req, res) => {
    try {
        const db = await database()
        await db.collection('invoices').updateOne(
            { _id: new ObjectId(req.invoice._id) },
            {
                $set: {
                    status: 'CANCELLED',
                    updated_at: Date.now(),
                },
            },
        )
        activity(req, `cancelled invoice #${req.invoice._id}`)
        return res.status(200).send()
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
