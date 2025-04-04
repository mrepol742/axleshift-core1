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
import { send } from '../../components/mail.js'

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
        const invoice = await invoicesCollection
            .aggregate([
                {
                    $match: {
                        freight_tracking_number: id,
                        status: { $ne: 'EXPIRED' },
                    },
                },
                {
                    $lookup: {
                        from: 'freight',
                        localField: 'freight_tracking_number',
                        foreignField: 'tracking_number',
                        as: 'freight_details',
                    },
                },
                { $unwind: { path: '$freight_details', preserveNullAndEmptyArrays: true } },
            ])
            .next()

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

/* WARNING CREATE HAS BEEN REMOVED */
/* WARNING UPDATE HAS BEEN REMOVED */

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
