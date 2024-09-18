import dotenv from 'dotenv'
dotenv.config()
import logger from '../logger.js'
import { MongoClient } from 'mongodb'

let dbInstance = null

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance
    }

    const client = new MongoClient(process.env.MONGO_URL)

    await client.connect()
    logger.info('Connected successfully to server')

    dbInstance = client.db(process.env.MONGO_DB)
    return dbInstance
}

export default connectToDatabase
