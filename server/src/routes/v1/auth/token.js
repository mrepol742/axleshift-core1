import { ObjectId } from 'mongodb'
import express from 'express'
import crypto from 'crypto'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import auth from '../../../middleware/auth.js'
import recaptcha from '../../../middleware/recaptcha.js'
import activity from '../../../components/activity.js'
import redis, { getCache, setCache, remCache, decrypt } from '../../../models/redis.js'

const router = express.Router()
const limit = 20

router.post('/', auth, async function (req, res, next) {
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
                    if (value && /^axleshift-core1:external-core1_[0-9a-f]{16}$/.test(key)) {
                        if (value.active == true) {
                            value.token = null
                            allData.push(value)
                        }
                    }
                })
            }
        }
        const allDataCount = allData.length
        const sortedAllData = allData.sort(
            (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
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

router.post('/new', [recaptcha, auth], async function (req, res, next) {
    try {
        const { note, whitelist_ip } = req.body
        if (!note || !whitelist_ip) return res.status(400).json({ error: 'Invalid request' })

        let allowedIp = whitelist_ip
        if (allowedIp.length > 6)
            return res.status(200).json({ error: 'Max number of whitelisted ip address reached' })

        if (allowedIp.length > 0 && allowedIp[0] !== '[]') {
            for (let i = 0; i < allowedIp.length; i++) {
                if (!/^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?$/.test(allowedIp[i])) {
                    if (
                        !/^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})(:\d{1,5})?$|^::([0-9a-fA-F]{1,4}:){0,6}([0-9a-fA-F]{1,4})?(:\d{1,5})?$|^([0-9a-fA-F]{1,4}:){1,7}:(:\d{1,5})?$/.test(
                            allowedIp[i],
                        )
                    )
                        return res
                            .status(200)
                            .json({ error: `Invalid IP Address '${allowedIp[i]}'` })
                }
            }
        }

        const apiT = `core1_${crypto.randomBytes(8).toString('hex')}`
        const dateNow = Date.now()
        const data = {
            _id: new ObjectId(),
            user_id: req.user._id,
            note: note,
            active: true,
            token: apiT,
            whitelist_ip: allowedIp[0] !== '[]' ? allowedIp : [],
            user_agent: 'unknown',
            created_at: dateNow,
            updated_at: dateNow,
            last_accessed: dateNow,
        }
        await setCache(`external-${apiT}`, data, 'none')

        activity(req, 'generate new auth token')
        return res.status(200).json({ token: apiT })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

router.post('/delete', [recaptcha, auth], async function (req, res, next) {
    try {
        const id = req.body.id
        if (!id) return res.status(400).json({ error: 'Invalid request' })
        const redisClient = await redis()
        const stream = redisClient.scanStream()
        let sessionData = null

        for await (const keys of stream) {
            if (keys.length > 0) {
                const filteredKeys = keys.map((key) => key.replace('axleshift-core1:', ''))
                const values = await redisClient.mget(filteredKeys)
                keys.forEach(async (key, index) => {
                    if (/^axleshift-core1:external-core1_[0-9a-f]{16}$/.test(key)) {
                        const value = JSON.parse(await decrypt(values[index]))
                        if (value && value._id === id) {
                            sessionData = value
                        }
                    }
                })
            }
        }

        if (!sessionData) return res.status(200).json({ error: 'Unable to find access token' })
        await remCache(`external-${sessionData.token}`)
        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
