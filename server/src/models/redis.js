import Redis from 'ioredis'
import logger from '../utils/logger.js'

let redisInstance = null
const DEFAULT_SESSION_TTL = 7 * 24 * 60 * 60 * 1000

const redis = async () => {
    if (redisInstance) return redisInstance

    try {
        const redisClient = new Redis({
            host: '127.0.0.1',
            port: 6379,
            keyPrefix: 'axleshift-core1:',
        })

        // Check if the connection is good
        await redisClient.ping()

        redisInstance = redisClient
        logger.info('successfully connected to Redis')
    } catch (e) {
        logger.error('failed connecting to redis')
        logger.error(e)
    }
    return redisInstance
}

export const clearRedisCache = async () => {
    try {
        const redisClient = await redis()
        await redisClient.flushall()
    } catch (e) {
        logger.error(e)
    }
}

export const getCache = async (key) => {
    try {
        const redisClient = await redis()
        const cache = await redisClient.get(key)
        if (cache) return JSON.parse(cache)
    } catch (e) {
        logger.error(e)
    }
    return null
}

export const setCache = async (key, value, SESSION_TTL) => {
    try {
        const redisClient = await redis()
        if (SESSION_TTL === 'none') {
            await redisClient.set(key, JSON.stringify(value), 'EX')
        } else {
            await redisClient.set(
                key,
                JSON.stringify(value),
                'EX',
                SESSION_TTL ? SESSION_TTL : DEFAULT_SESSION_TTL,
            )
        }
        return true
    } catch (e) {
        logger.error(e)
    }
    return false
}

export const remCache = async (key) => {
    try {
        const redisClient = await redis()
        await redisClient.del(key)
        return true
    } catch (e) {
        logger.error(e)
    }
    return false
}

export default redis
