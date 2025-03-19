import { ObjectId } from 'mongodb'
import database from '../models/mongodb.js'
import logger from '../utils/logger.js'

const sessions = () => {
    Promise.all([
        (async () => {
            try {
                const db = await database()
                const redisClient = await redis()
                const sessionsCollection = db.collection('sessions')
                const sessions = await sessionsCollection.find({ active: false }).toArray()

                if (sessions.length === 0) return

                for (const session of sessions) {
                    const last_accessed = new Date(session.last_accessed)
                    const diff = Date.now() - last_accessed
                    const week = 7 * 24 * 60 * 60 * 1000

                    if (diff >= week) {
                        const cacheKey = `axleshift-core1:${session.token}`
                        const cachedSession = await redisClient.get(cacheKey)
                        if (cachedSession) {
                            await redisClient.del(cacheKey)
                        }

                        sessionsCollection.updateOne(
                            { _id: new ObjectId(session._id) },
                            {
                                $set: {
                                    active: false,
                                    last_accessed: Date.now(),
                                    modified_by: 'system',
                                },
                            },
                        )
                    }
                }
            } catch (e) {
                logger.error(e)
            }
        })(),
    ])
}

export default sessions
