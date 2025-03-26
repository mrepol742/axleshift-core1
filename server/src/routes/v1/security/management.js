import { ObjectId } from 'mongodb'
import express from 'express'
import useragent from 'useragent'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import dependabot from '../../../components/dependabot.js'
import sentry from '../../../components/sentry.js'
import auth from '../../../middleware/auth.js'
import recaptcha from '../../../middleware/recaptcha.js'
import redis, { clearRedisCache, setCache, remCache } from '../../../models/redis.js'

const router = express.Router()
const limit = 20

router.get('/', auth, async (req, res, next) => res.status(301).send())

router.post('/sessions', auth, async (req, res, next) => {
    try {
        const { page } = req.body
        if (!page) return res.status(400).json({ error: 'Invalid request' })
        const current_page = parseInt(page) || 1
        const skip = (current_page - 1) * limit

        const redisClient = await redis()
        const stream = redisClient.scanStream()
        const allData = []

        for await (const keys of stream) {
            if (keys.length > 0) {
                const filteredKeys = keys.map((key) => key.replace('axleshift-core1:', ''))
                const values = await redisClient.mget(filteredKeys)
                keys.forEach((key, index) => {
                    const value = JSON.parse(values[index])
                    if (value && /^axleshift-core1:internal-[0-9a-f]{32}$/.test(key)) {
                        const agent = useragent.parse(value.user_agent)
                        value.user_agent = `${agent.os.family} ${agent.family}`
                        value.token = null
                        allData.push(value)
                    }
                })
            }
        }
        const allDataCount = allData.length
        const sortedAllData = allData.sort(
            (a, b) => new Date(b.last_accessed) - new Date(a.last_accessed),
        )
        const paginatedData = sortedAllData.slice(skip, skip + limit)

        return res.status(200).json({
            data: paginatedData,
            totalPages: Math.ceil(allDataCount / limit),
            currentPage: current_page,
        })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

router.post('/sessions/logout', [recaptcha, auth], async (req, res, next) => {
    try {
        const redisClient = await redis()
        const stream = redisClient.scanStream()
        let sessionData = null

        for await (const keys of stream) {
            if (keys.length > 0) {
                const filteredKeys = keys.map((key) => key.replace('axleshift-core1:', ''))
                const values = await redisClient.mget(filteredKeys)
                keys.forEach(async (key, index) => {
                    const value = JSON.parse(values[index])
                    if (value && /^axleshift-core1:internal-[0-9a-f]{32}$/.test(key)) {
                        await remCache(`internal-${value.token}`)
                    }
                })
            }
        }
        return res.status(200).json({ message: 'All sessions have been logged out' })
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
router.get('/ip-filtering', auth, async (req, res, next) => res.status(200).send())
router.get('/geo', auth, async (req, res, next) => res.status(200).send())

export default router
