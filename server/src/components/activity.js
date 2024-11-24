import { ObjectId } from 'mongodb'
import database from '../models/mongodb.js'
import logger from './logger.js'
import { getClientIp } from './ip.js'

const activity = async (req, event) => {
    try {
        Promise.all([
            (async () => {
                const db = await database()
                const user_agent = req.headers['user-agent'] || 'unknown'
                db.collection('activityLog').insertOne({
                    user_id: req.user._id,
                    session_id: req.session._id,
                    event: event,
                    time: Date.now(),
                    ip_address: getClientIp(req),
                    user_agent: user_agent,
                })
            })(),
        ])
    } catch (e) {
        logger.error(e)
    }
}

export default activity
