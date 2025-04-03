import { ObjectId } from 'mongodb'
import express from 'express'
import { Xendit } from 'xendit-node'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import auth from '../../../middleware/auth.js'
import freight from '../../../middleware/freight.js'
import invoices from '../../../middleware/invoices.js'
import recaptcha from '../../../middleware/recaptcha.js'
import { NODE_ENV } from '../../../config.js'
import activity from '../../../components/activity.js'
import documents from '../../../middleware/documents.js'

const router = express.Router()
const limit = 20

/**
 * Get all documents
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
        const documentsCollection = db.collection('documents')

        const [totalItems, items] = await Promise.all([
            documentsCollection.countDocuments(filter),
            documentsCollection
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
router.get('/:id', [auth, documents], async (req, res) => res.status(200).json(req.documents))

/**
 * Upload a document
 */
router.post('/upload', [recaptcha, auth], async (req, res) => {
    try {
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})
export default router
