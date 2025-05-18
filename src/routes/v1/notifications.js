import { ObjectId } from 'mongodb'
import express from 'express'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import auth from '../../middleware/auth.js'

const router = express.Router()

/**
 * Get notifications
 */
router.get('/', [auth], async (req, res, next) => {
    try {
        const db = await database()
        const isUser = req.user ? !['super_admin', 'admin', 'staff'].includes(req.user.role) : null
        const filter = isUser ? { user_id: req.user._id } : {}

        const notifications = await db
            .collection('notifications')
            .find(filter)
            .sort({ time: -1 })
            .limit(10)
            .toArray()
        return res.status(200).json(notifications)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Mark all notifications as read
 */
router.post('/', [auth], async (req, res, next) => {
    try {
        const db = await database()
        await db
            .collection('notifications')
            .updateMany({ user_id: req.user._id, is_read: false }, { $set: { is_read: true } })
        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
