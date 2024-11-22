import { ObjectId } from 'mongodb'
import database from '../models/mongodb.js'
import logger from './logger.js'

const activity = async (theUser, session, type, message) => {
    try {
        Promise.all([
            (async () => {
                const db = await database()
                db.collection('activityLog').insertOne({
                    user_id: theUser._id,
                    session_id: session._id,
                    type: type,
                    message: message,
                    created_at: Date.now(),
                })
            })(),
        ])
    } catch (e) {
        logger.error(e)
    }
}

export default activity
