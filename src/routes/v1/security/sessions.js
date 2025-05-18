import { ObjectId } from 'mongodb'
import express from 'express'
import useragent from 'useragent'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import auth from '../../../middleware/auth.js'
import recaptcha from '../../../middleware/recaptcha.js'
import redis, { setCache, remCache, decrypt } from '../../../models/redis.js'

const router = express.Router()
const limit = 20

router.post('/', auth, async (req, res) => {
    try {
        const { page } = req.body
        if (!page) return res.status(400).json({ error: 'Invalid request' })
        const current_page = parseInt(page) || 1
        const skip = (current_page - 1) * limit

        const redisClient = await redis()
        const stream = redisClient.scanStream()
        const allData = []
        let currentSession = null

        for await (const keys of stream) {
            if (keys.length > 0) {
                const filteredKeys = keys.map((key) => key.replace('axleshift-core1:', ''))
                const values = await redisClient.mget(filteredKeys)
                keys.forEach(async (key, index) => {
                    const value = JSON.parse(await decrypt(values[index]))
                    // validate its internal token
                    if (value && /^axleshift-core1:internal-[0-9a-f]{32}$/.test(key)) {
                        const agent = useragent.parse(value.user_agent)
                        value.user_agent = `${agent.os.family} ${agent.family}`
                        const _tt = value.token
                        value.token = null
                        if (_tt === req.session.token) {
                            currentSession = value
                        } else if (value.user_id === req.user._id.toString()) {
                            allData.push(value)
                        }
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
            data: {
                sessions: paginatedData,
                current_session: currentSession,
                logout: !(allDataCount > 0),
            },
            totalPages: Math.ceil(allDataCount / limit),
            currentPage: current_page,
        })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

router.post('/logout', [recaptcha, auth], async (req, res) => {
    try {
        const session_id = req.body.session_id
        const redisClient = await redis()
        const stream = redisClient.scanStream()
        let sessionData = null

        for await (const keys of stream) {
            if (keys.length > 0) {
                const filteredKeys = keys.map((key) => key.replace('axleshift-core1:', ''))
                const values = await redisClient.mget(filteredKeys)
                keys.forEach(async (key, index) => {
                    if (/^axleshift-core1:internal-[0-9a-f]{32}$/.test(key)) {
                        const value = JSON.parse(await decrypt(values[index]))
                        if (value && value._id === session_id) {
                            sessionData = value
                        }
                        if (
                            !session_id &&
                            value.user_id === req.user._id.toString() &&
                            value.token !== req.session.token
                        ) {
                            await remCache(`internal-${value.token}`)
                        }
                    }
                })
            }
        }

        if (sessionData) {
            await remCache(`internal-${sessionData.token}`)
            return res.status(200).json({ message: 'Session logout' })
        }

        return res.status(200).json({ message: 'Other sessions have been logged out' })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
