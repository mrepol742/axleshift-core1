import Redis from 'ioredis'
import crypto from 'crypto'
import logger from '../utils/logger.js'
import { APP_KEY } from '../config.js'

let redisInstance = null
const DEFAULT_SESSION_TTL = 7 * 24 * 60 * 60 * 1000
const key = crypto.createHash('sha256').update(APP_KEY).digest()

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

export const encrypt = async (plaintext) => {
    try {
        const iv = crypto.randomBytes(12)
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

        const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
        const tag = cipher.getAuthTag()

        return JSON.stringify({
            iv: iv.toString('hex'),
            ciphertext: encrypted.toString('hex'),
            tag: tag.toString('hex'),
        })
    } catch (e) {
        logger.error(e)
        return plaintext
    }
}

export const decrypt = async (encryptedData) => {
    let parsed
    try {
        parsed = JSON.parse(encryptedData)
    } catch (e) {
        return encryptedData
    }

    if (!parsed || typeof parsed !== 'object') return encryptedData

    const { iv, ciphertext, tag } = parsed
    if (!iv || !ciphertext || !tag) return encryptedData

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'))
    decipher.setAuthTag(Buffer.from(tag, 'hex'))

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(ciphertext, 'hex')),
        decipher.final(),
    ])

    return decrypted.toString('utf8')
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
        if (cache) {
            const decrypted = await decrypt(cache)
            try {
                return JSON.parse(decrypted)
            } catch (e) {
                logger.error('Failed to parse decrypted cache:', e)
                return decrypted
            }
        }
    } catch (e) {
        logger.error(e)
    }
    return null
}

export const setCache = async (key, value, SESSION_TTL) => {
    try {
        const redisClient = await redis()
        if (SESSION_TTL === 'none') {
            await redisClient.set(key, await encrypt(JSON.stringify(value)))
        } else {
            await redisClient.set(
                key,
                await encrypt(JSON.stringify(value)),
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
