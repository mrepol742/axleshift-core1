import { ObjectId } from 'mongodb'
import express from 'express'
import useragent from 'useragent'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import dependabot from '../../../components/dependabot.js'
import sentry from '../../../components/sentry.js'
import auth from '../../../middleware/auth.js'
import recaptcha from '../../../middleware/recaptcha.js'
import redis, { clearRedisCache } from '../../../models/redis.js'

const router = express.Router()
const limit = 20

router.get('/', auth, async (req, res, next) => res.status(301).send())

router.post('/sessions', auth, async (req, res, next) => {
    try {
        const { page } = req.body
        if (!page) return res.status(400).json({ error: 'Invalid request' })
        const current_page = parseInt(page) || 1
        const skip = (current_page - 1) * limit

        const db = await database()
        const sessionsCollection = db.collection('sessions')

        const [totalItems, sessions] = await Promise.all([
            sessionsCollection.countDocuments({}),
            sessionsCollection
                .aggregate([
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user_id',
                            foreignField: '_id',
                            as: 'user',
                        },
                    },
                    {
                        $sort: { last_accessed: -1 },
                    },
                ])
                .skip(skip)
                .limit(limit)
                .toArray(),
        ])

        sessions.forEach((session) => {
            const user_agent = session.user_agent
            const agent = useragent.parse(user_agent)
            session.user_agent = `${agent.os.family} ${agent.family}`
        })

        return res.status(200).json({
            data: sessions,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: current_page,
        })
    } catch (e) {
        logger.error(e)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

router.post('/sessions/logout', [recaptcha, auth], async (req, res, next) => {
    try {
        const db = await database()
        await db.collection('sessions').updateMany(
            {
                active: true,
            },
            {
                $set: {
                    active: false,
                    last_accessed: Date.now(),
                    modified_by: 'system',
                },
            },
        )
        clearRedisCache()
        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

router.get('/dependabot', auth, async (req, res, next) => {
    try {
        const response = await dependabot()
        return res.status(200).json(response)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

router.get('/sentry', auth, async (req, res, next) => {
    try {
        const response = await sentry()
        return res.status(200).json(response)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

router.post('/apikeys', auth, async (req, res, next) => {
    try {
        const { page } = req.body
        if (!page) return res.status(400).json({ error: 'Invalid request' })
        const current_page = parseInt(page) || 1
        const skip = (current_page - 1) * limit

        const db = await database()
        const apiTokenCollection = await db.collection('apiToken')

        const [activeApiTokenCount, apiToken] = await Promise.all([
            apiTokenCollection.countDocuments({ active: true, compromised: false }),
            apiTokenCollection.find().sort({ created_at: -1 }).toArray(),
        ])

        for (let i = 0; i < apiToken.length; i++) {
            const token = apiToken[i].token
            apiToken[i].token = token.match(/(?<=core1_)\w{14}/)[0]

            const user_agent = apiToken[i].user_agent
            const agent = useragent.parse(user_agent)
            apiToken[i].user_agent = `${agent.os.family} ${agent.family}`
        }

        return res.status(200).json({
            data: { apiToken: apiToken, deny: !(activeApiTokenCount > 0) },
            totalPages: Math.ceil(activeApiTokenCount / limit),
            currentPage: current_page,
        })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

router.post('/apikeys/deactivate', [recaptcha, auth], async (req, res, next) => {
    try {
        const db = await database()
        await db.collection('apiToken').updateMany(
            {
                active: true,
            },
            {
                $set: {
                    active: false,
                    updated_at: Date.now(),
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

router.post('/activity', auth, async (req, res, next) => {
    try {
        const { page } = req.body
        if (!page) return res.status(400).json({ error: 'Invalid request' })
        const current_page = parseInt(page) || 1
        const skip = (current_page - 1) * limit

        const db = await database()
        const activityLogCollection = db.collection('activityLog')

        const [totalItems, activityLog] = await Promise.all([
            activityLogCollection.countDocuments({}),
            activityLogCollection.find().sort({ time: -1 }).skip(skip).limit(limit).toArray(),
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
    res.status(500).json({ error: 'Internal server error' })
})

router.get('/maintenance', auth, async (req, res, next) => res.status(200).send())

export default router
