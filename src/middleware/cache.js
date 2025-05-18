import axios from 'axios'
import { ObjectId } from 'mongodb'
import logger from '../utils/logger.js'
import database from '../models/mongodb.js'
import crypto from 'crypto'
import { setCache, getCache } from '../models/redis.js'
import { getClientIp } from '../components/ip.js'

// this is an experimental middleware in order to
// speed up the response time of the server
// by caching the response of the request
const cache = async (req, res, next) => {
    if (req.request_type === 'internal') return next()
    // THIS IS EXPERIMENTAL AND NOT YET IMPLEMENTED
    return next()

    const ip = getClientIp(req)
    const data = req.body ? JSON.stringify(req.body) : JSON.stringify(req.params)
    const hash =
        'cache-' +
        crypto
            .createHash('sha256')
            .update(data + ip)
            .digest('hex')
    const cachedData = await getCache(hash)
    if (cachedData) return res.status(200).json(cachedData)

    req.cacheKey = hash
    next()
}

export default cache
