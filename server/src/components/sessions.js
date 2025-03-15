import { ObjectId } from 'mongodb'
import database from '../models/mongodb.js'
import logger from '../utils/logger.js'
import activity from './activity.js'

export const addSession = async (theUser, sessionToken, ip, userAgent, location) => {
    try {
        const db = await database()
        const sessionsCollection = db.collection('sessions')
        const session = await sessionsCollection.insertOne({
            user_id: theUser._id,
            token: sessionToken,
            active: true,
            ip_address: ip,
            user_agent: userAgent,
            compromised: false,
            location: location,
            last_accessed: Date.now(),
        })
        const req = {
            headers: {
                'user-agent': userAgent,
                'x-forwarded-for': ip,
            },
            user: { _id: theUser._id },
            session: { _id: session._id },
        }

        if (theUser.log) activity(req, theUser.log)
        if (theUser.log1) activity(req, theUser.log1)
        activity(req, 'login')
    } catch (e) {
        logger.error(e)
    }
}

export const getUser = async (sessionToken) => {
    try {
        const db = await database()
        const isApiToken = /^core1_[0-9a-f]{16}$/.test(sessionToken)
        const endpoint = isApiToken ? 'apiToken' : 'sessions'
        const tokenCollection = await db
            .collection(endpoint)
            .findOne({ token: sessionToken, active: true }, { projection: { user_id: 1 } })
        if (!tokenCollection) return null
        const theUser = await db
            .collection('users')
            .findOne(
                { _id: new ObjectId(tokenCollection.user_id) },
                {
                    projection: {
                        _id: 1,
                        email: 1,
                        first_name: 1,
                        last_name: 1,
                        role: 1,
                        email_verify_at: 1,
                        oauth2: 1,
                        password: { $cond: { if: { $ne: ['$password', null] }, then: 'OK', else: null } },
                        timezone: 1,
                        ref: 1,
                    },
                }
            )

        if (theUser) return theUser
    } catch (e) {
        logger.error(e)
    }
    return null
}

export const removeSession = async (sessionToken) => {
    try {
        const db = await database()
        await db.collection('sessions').updateOne(
            { token: sessionToken },
            {
                $set: {
                    active: false,
                    last_accessed: Date.now(),
                    modified_by: 'system',
                },
            },
        )
    } catch (e) {
        logger.error(e)
    }
}


export const getSession = async (sessionToken) => {
    try {
        const db = await database()
        const session = await db.collection('sessions').findOneAndUpdate(
            { token: sessionToken },
            { $set: { last_accessed: Date.now() } },
            { returnDocument: 'after' }
        )
        return session
    } catch (e) {
        logger.error(e)
    }
    return null
}
