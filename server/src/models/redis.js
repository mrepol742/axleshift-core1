import Redis from 'ioredis'
import logger from '../utils/logger.js'

let redisInstance = null

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

export default redis
