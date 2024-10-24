import dotenv from 'dotenv'
dotenv.config()
import { ObjectId } from 'mongodb'
import logger from '../logger.js'
import { getUser, getSession } from '../sessions.js'
import database from '../../models/db.js'
import { getClientIp } from '../ip.js'

const adminRoute = []

const internal = async (req, res, next) => {
    let ip = getClientIp(req)
    if (process.env.REACT_APP_ORIGIN !== ip) return res.status(403).send()

    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]

    const [theUser, session] = await Promise.all([getUser(token), getSession(token)])

    if (!theUser || (adminRoute.includes(req.path) && theUser.role !== 'admin'))
        return res.status(401).send()

    if (!session.active) return res.status(401).send()
    const user_a = req.headers['user-agent']

    const diff = Date.now() - session.last_accessed
    const week = 7 * 24 * 60 * 60 * 1000
    // a week has pass so change the ip to 0
    // thus triggering the protocol down below!
    // hacky aint it?
    if (diff >= week) {
        ip = 0
        logger.info(week)
        logger.info(diff)
        logger.info(session.last_accessed)
    }

    Promise.all([
        (async () => {
            try {
                const db = await database()
                const value = session.ip_address === ip && session.user_agent === user_a
                db.collection('sessions').updateOne(
                    { token: token },
                    {
                        $set: {
                            active: value,
                            compromised: value,
                            last_accessed: Date.now(),
                            modified_by: 'system',
                        },
                    },
                )
            } catch (e) {
                logger.error(e)
            }
        })(),
    ])

    if (session.ip_address !== ip || session.user_agent !== user_a) return res.status(401).send()

    req.token = token
    req.user = theUser

    if (theUser.role === 'admin') return next()

    setTimeout(() => {
        return next()
    }, process.env.API_RATE_DELAY)
}

export default internal
