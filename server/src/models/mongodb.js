import fs from 'fs'
import { MongoClient } from 'mongodb'
import logger from '../utils/logger.js'
import { MONGO_URL, MONGO_DB } from '../config.js'

let dbInstance = null

const mongodb = async () => {
    if (dbInstance) return dbInstance

    try {
        const client = new MongoClient(MONGO_URL)
        await client.connect()

        dbInstance = client.db(MONGO_DB)
        logger.info('successfully connected to MongoDB Atlas')
    } catch (e) {
        logger.error('failed connecting to mongodb atlas')
        logger.error(e)
    }
    return dbInstance
}

export default mongodb
