import express from 'express'
import useragent from 'useragent'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import auth from '../../../middleware/auth.js'

const router = express.Router()
const limit = 20

router.post('/', auth, async (req, res) => {
    try {
        const { page } = req.body
        if (!page) return res.status(400).send()
        const current_page = parseInt(page) || 1
        const skip = (current_page - 1) * limit

        const db = await database()
        const activityLogCollection = db.collection('activityLog')

        const [totalItems, activityLog] = await Promise.all([
            activityLogCollection.countDocuments({ user_id: req.user._id }),
            activityLogCollection
                .find({ user_id: req.user._id })
                .sort({ time: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
        ])

        for (let i = 0; i < activityLog.length; i++) {
            const user_agent = activityLog[i].user_agent
            const agent = useragent.parse(user_agent)
            activityLog[i].user_agent = `${agent.os.family} ${agent.family}`
        }

        return res.status(200).json({
            data: activityLog,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: current_page,
        })
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
})

export default router
