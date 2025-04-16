import { ObjectId } from 'mongodb'
import express from 'express'
import useragent from 'useragent'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import dependabot from '../../../components/dependabot.js'
import sentry from '../../../components/sentry.js'
import auth from '../../../middleware/auth.js'
import recaptcha from '../../../middleware/recaptcha.js'
import redis, { setCache, remCache, getCache, decrypt } from '../../../models/redis.js'

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
                keys.forEach(async (key, index) => {
                    const value = JSON.parse(await decrypt(values[index]))
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

        return res.sendGzipped(200, {
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
                    const value = JSON.parse(await decrypt(values[index]))
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

        return res.sendGzipped(200, {
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

router.get('/ip-filtering', auth, async (req, res, next) => {
    try {
        const ipFiltering = await getCache(`ip-filtering`)
        return res.status(200).json(
            ipFiltering
                ? ipFiltering
                : {
                      filter_mode: 'whitelist',
                      ip: [],
                  },
        )
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

router.post('/ip-filtering', [recaptcha, auth], async (req, res, next) => {
    try {
        const { filter_mode, ip } = req.body
        if (!filter_mode || !ip || !Array.isArray(ip))
            return res.status(400).json({ error: 'Invalid request' })
        if (!['whitelist', 'blacklist'].includes(filter_mode))
            return res.status(400).json({ error: 'Invalid request' })

        let allowedIp = ip
        let ipAddress = []

        if (allowedIp.length > 0 && allowedIp[0] !== '[]') {
            for (let i = 0; i < allowedIp.length; i++) {
                // verify ip
                if (!/^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?$/.test(allowedIp[i].ip)) {
                    // verify if its IPv6
                    if (
                        /^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})(:\d{1,5})?$|^::([0-9a-fA-F]{1,4}:){0,6}([0-9a-fA-F]{1,4})?(:\d{1,5})?$|^([0-9a-fA-F]{1,4}:){1,7}:(:\d{1,5})?$/.test(
                            allowedIp[i].ip,
                        )
                    )
                        return res
                            .status(200)
                            .json({ error: `IPv6 is not allowed: '${allowedIp[i].ip}'` })
                    // verify if its not range ipv4
                    if (
                        !/^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?-(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?$/.test(
                            allowedIp[i].ip,
                        )
                    )
                        return res
                            .status(200)
                            .json({ error: `Invalid IP Address '${allowedIp[i].ip}'` })
                }
                ipAddress.push(allowedIp[i].ip)
            }
        }

        await setCache(`ip-filtering`, {
            filter_mode: filter_mode,
            ip: ipAddress,
        })

        return res.status(200).json()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

router.get('/geo', auth, async (req, res, next) => {
    try {
        const geoFiltering = await getCache(`geo`)
        return res.status(200).json(
            geoFiltering
                ? geoFiltering
                : {
                      filter_mode: 'whitelist',
                      geo: [],
                  },
        )
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

router.post('/geo', [recaptcha, auth], async (req, res, next) => {
    try {
        const { filter_mode, geo } = req.body
        if (!filter_mode || !geo || !Array.isArray(geo))
            return res.status(400).json({ error: 'Invalid request' })
        if (!['whitelist', 'blacklist'].includes(filter_mode))
            return res.status(400).json({ error: 'Invalid request' })

        let allowedGeo = geo
        let geoLocation = []

        if (allowedGeo.length > 0 && allowedGeo[0] !== '[]') {
            for (let i = 0; i < allowedGeo.length; i++) {
                if (!/[-+]?(90(\.0+)?|[1-8]?\d(\.\d+)?)/.test(allowedGeo[i].geo.latitude))
                    return res
                        .status(200)
                        .json({ error: `Invalid latitude '${allowedGeo[i].geo.latitude}'` })

                if (
                    !/[-+]?(180(\.0+)?|1[0-7]\d(\.\d+)?|[1-9]?\d(\.\d+)?)/.test(
                        allowedGeo[i].geo.longitude,
                    )
                )
                    return res
                        .status(200)
                        .json({ error: `Invalid longitude '${allowedGeo[i].geo.longitude}'` })

                geoLocation.push(allowedGeo[i].geo)
            }
        }

        await setCache(`geo`, {
            filter_mode: filter_mode,
            geo: geoLocation,
        })

        return res.status(200).json()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})
export default router
