import express from 'express'
import database from '../../../models/mongodb.js'
import logger from '../../../components/logger.js'
import auth from '../../../middleware/auth.js'

const router = express.Router()

router.get('/', auth, async (req, res) => {
    try {
        const db = await database()
        const activityLog = await db
            .collection('activityLog')
            .find({ user_id: req.user._id })
            .sort({ created_at: -1 })
            .toArray()

        if (activityLog) return res.status(200).json(activityLog)
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
})

export default router
