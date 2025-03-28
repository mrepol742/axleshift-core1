import { ObjectId } from 'mongodb'
import express from 'express'
import { Xendit } from 'xendit-node'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import auth from '../../middleware/auth.js'
import freight from '../../middleware/freight.js'
import invoices from '../../middleware/invoices.js'
import recaptcha from '../../middleware/recaptcha.js'
import { NODE_ENV } from '../../config.js'
import activity from '../../components/activity.js'
import address from '../../middleware/address.js'

const router = express.Router()
const limit = 20

/**
 * Get all addresses
 */
router.post('/', auth, async (req, res) => {
    try {
        // if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
        const { page } = req.body
        if (!page) return res.status(400).json({ error: 'Invalid request' })
        const current_page = parseInt(page) || 1
        const skip = (current_page - 1) * limit
        const isUser = req.user ? !['super_admin', 'admin', 'staff'].includes(req.user.role) : null

        let filter = isUser ? { user_id: req.user._id } : {}
        const db = await database()
        const addressesCollection = db.collection('addresses')

        const [totalItems, items] = await Promise.all([
            addressesCollection.countDocuments(filter),
            addressesCollection
                .find(filter)
                .sort({ last_accessed: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
        ])

        const data = {
            data: items,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: current_page,
        }

        return res.status(200).json(data)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Get address by ID
 */
router.get('/:id', [auth, address], async (req, res) => res.status(200).json(req.address))

/**
 * Create an address
 */
router.post('/add', [recaptcha, auth], async (req, res) => {
    try {
        const { from, to } = req.body
        const db = await database()
        const date = Date.now()
        await db.collection('addresses').insertOne({
            user_id: req.user._id,
            session_id: req.session._id,
            from,
            to,
            created_at: date,
            updated_at: date,
            last_accessed: date,
        })
        activity(req, `created an address`)
        return res.status(201).json({ message: 'Address has been created.' })
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Update an address
 */
router.post('/update/:id', [recaptcha, auth, address], async (req, res) => {
    try {
        const { from, to } = req.body
        const db = await database()
        const date = Date.now()
        await db.collection('addresses').updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    from,
                    to,
                    updated_at: date,
                },
            },
        )
        activity(req, `update an address`)
        return res.status(201).json({ message: 'Address has been updated.' })
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Find an address base on country, city and zip code
 */
router.post('/find/', [recaptcha, auth], async (req, res) => {
    try {
        const { from, to } = req.body
        const db = await database()
        const address = await db.collection('addresses').findOne({
            $or: [
                { 'from.country': from.country },
                { 'from.city': from.city },
                { 'from.zip_code': from.zip_code },
                { 'to.country': to.country },
                { 'to.city': to.city },
                { 'to.zip_code': to.zip_code },
            ],
        })

        if (!address)
            return res
                .status(404)
                .json({
                    error: 'Unable to auto fill the necessary form, manual intervention required.',
                })
        return res.status(200).json(address)
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Remove a address
 */
router.post('/remove/:id', [recaptcha, auth, address], async (req, res, next) => {
    try {
        return res.status(200).send({})
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
