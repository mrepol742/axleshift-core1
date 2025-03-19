import { ObjectId } from 'mongodb'
import express from 'express'
import useragent from 'useragent'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import auth from '../../../middleware/auth.js'
import recaptcha from '../../../middleware/recaptcha.js'
import redis from '../../../models/redis.js'

const router = express.Router()

router.get('/', auth, async (req, res) => {
    try {
        const db = await database()
        const sessionsCollection = await db.collection('sessions')

        const filter = { user_id: req.user._id, active: true }
        const [sessions, session, activeSessionsCount] = await Promise.all([
            sessionsCollection.find(filter).sort({ last_accessed: -1 }).toArray(),
            sessionsCollection.findOne({ token: req.session.token }),
            sessionsCollection.countDocuments(filter),
        ])

        const agent = useragent.parse(session.user_agent)
        session.user_agent = `${agent.os.family} ${agent.family}`

        for (let i = 0; i < sessions.length; i++) {
            const agent = useragent.parse(sessions[i].user_agent)
            sessions[i].user_agent = `${agent.os.family} ${agent.family}`
        }
        const _sessions = sessions.filter((item) => item.token !== req.session.token)

        if (session)
            return res.status(200).json({
                sessions: _sessions,
                current_session: {
                    ip_address: session.ip_address,
                    user_agent: session.user_agent,
                },
                logout: !(activeSessionsCount > 1),
            })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

router.post('/logout', [recaptcha, auth], async (req, res) => {
    try {
        const session_id = req.body.session_id
        logger.info(session_id)
        const db = await database()
        const redisClient = await redis()
        const cacheKey = `axleshift-core1:${req.token}`
        const cachedSession = await redisClient.get(cacheKey)
        if (cachedSession) await redisClient.del(cacheKey)

        await db.collection('sessions').updateMany(
            {
                _id: session_id ? new ObjectId(session_id) : { $ne: '0' },
                user_id: session_id ? { $ne: '0' } : req.user._id,
                token: { $ne: req.token },
            },
            {
                $set: {
                    active: false,
                    last_accessed: Date.now(),
                    modified_by: 'system',
                },
            },
        )
        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
