import { ObjectId } from 'mongodb'
import database from '../models/mongodb.js'
import logger from '../utils/logger.js'
import activity from './activity.js'
import redis, { getCache, setCache, remCache } from '../models/redis.js'
import { getClientIp } from './ip.js'

const SESSION_TTL = 7 * 24 * 60 * 60 * 1000

export const addSession = async (theUser, sessionToken, ip, userAgent, location) => {
    try {
        const data = {
            _id: new ObjectId(),
            user_id: theUser._id,
            token: sessionToken,
            active: true,
            ip_address: ip,
            user_agent: userAgent,
            compromised: false,
            location: location,
            last_accessed: Date.now(),
        }
        setCache(`internal-${sessionToken}`, data)

        const req = {
            headers: {
                'user-agent': userAgent,
                'x-forwarded-for': ip,
            },
            user: { _id: theUser._id },
            session: { _id: data._id },
        }

        if (theUser.log) activity(req, theUser.log)
        if (theUser.log1) activity(req, theUser.log1)
        activity(req, 'login')
    } catch (e) {
        logger.error(e)
    }
}

export const getUser = async (cachedSession, sessionToken) => {
    try {
        const db = await database()
        const user = await db.collection('users').findOne(
            { _id: new ObjectId(cachedSession.user_id) },
            {
                projection: {
                    _id: 1,
                    email: 1,
                    first_name: 1,
                    last_name: 1,
                    role: 1,
                    email_verify_at: 1,
                    oauth2: 1,
                    password: {
                        $cond: { if: { $ne: ['$password', null] }, then: 'OK', else: null },
                    },
                    timezone: 1,
                    ref: 1,
                },
            },
        )
        return user
    } catch (e) {
        logger.error(e)
    }
    return null
}

export const removeSession = async (sessionToken) => {
    try {
        remCache(`internal-${sessionToken}`)
    } catch (e) {
        logger.error(e)
    }
}

export const getSession = async (req, sessionToken) => {
    try {
        const cachedSession = await getCache(`internal-${sessionToken}`)
        if (!cachedSession) return null

        const diff = Date.now() - cachedSession.last_accessed
        const week = 7 * 24 * 60 * 60 * 1000
        if (diff >= week) return null

        const now = Date.now()
        if (now - cachedSession.last_accessed > 60 * 1000) {
            cachedSession.last_accessed = now
            ;(cachedSession.ip_address = getClientIp(req)),
                (cachedSession.user_agent = req.headers['user-agent'] || 'unknown'),
                setCache(`internal-${sessionToken}`, cachedSession)
        }
        return cachedSession
    } catch (e) {
        logger.error(e)
    }
    return null
}
