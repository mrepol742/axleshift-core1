import express from 'express'
import useragent from 'useragent'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import auth from '../../../middleware/auth.js'

const router = express.Router()

router.get('/', auth, async (req, res) => {
    try {
        const db = await database()
        const activityLog = await db
            .collection('activityLog')
            .find({ user_id: req.user._id })
            .sort({ time: -1 })
            .toArray()

        for (let i = 0; i < activityLog.length; i++) {
            const user_agent = activityLog[i].user_agent
            const agent = useragent.parse(user_agent)
            activityLog[i].user_agent = `${agent.os.family} ${agent.family}`
        }

        if (activityLog) return res.status(200).json(activityLog)
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
})

export default router
