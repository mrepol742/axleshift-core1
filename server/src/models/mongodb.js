import { MongoClient } from 'mongodb'
import logger from '../utils/logger.js'
import { MONGO_URL, MONGO_DB } from '../config.js'

let client = null
let dbInstance = null
let connectionPromise = null

const mongodb = async () => {
    if (dbInstance) return dbInstance

    if (connectionPromise) return connectionPromise

    connectionPromise = (async () => {
        try {
            client = new MongoClient(MONGO_URL)

            await client.connect()

            dbInstance = client.db(MONGO_DB)

            logger.info('Successfully connected to MongoDB Atlas')

            return dbInstance
        } catch (error) {
            logger.error('Failed connecting to MongoDB Atlas')
            logger.error(error)

            // Reset connection promise for retry
            connectionPromise = null

            throw error
        }
    })()

    return connectionPromise
}

export const closeMongoConnection = async () => {
    if (client) {
        await client.close()

        logger.info('MongoDB connection closed')

        client = null
        dbInstance = null
        connectionPromise = null
    }
}

export default mongodb
