import database from '../models/mongodb.js'
import logger from '../utils/logger.js'

const Device = (theUser, device) => {
    Promise.all([
        (async () => {
            try {
                const db = await database()
                db.collection('users').updateOne(
                    { _id: new ObjectId(theUser._id) },
                    {
                        $set: {
                            last_accessed: Date.now(),
                        },
                        $addToSet: {
                            devices: device,
                        },
                    },
                )
            } catch (e) {
                logger.error(e)
            }
        })(),
    ])
}

export default Device
