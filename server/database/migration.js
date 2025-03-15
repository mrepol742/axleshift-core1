import fs from 'fs'
import { MongoClient } from 'mongodb'
import logger from '../src/utils/logger.js'
import { MONGO_URL, MONGO_DB } from '../src/config.js'

const requiredCollections = [
    'users',
    'freight',
    'sessions',
    'threats',
    'otp',
    'newsletter',
    'apiToken',
    'activityLog',
    'invoices',
    'rates',
    'couriers',
]

const mongodb = async () => {
    try {
        const client = new MongoClient(MONGO_URL)
        await client.connect()

        const dbInstance = client.db(MONGO_DB)

        const collections = await dbInstance.listCollections().toArray()
        const collectionNames = collections.map((c) => c.name)

        const creationPromises = requiredCollections
            .filter((name) => !collectionNames.includes(name))
            .map((name) => dbInstance.createCollection(name))
        await Promise.all(creationPromises)
    } catch (e) {
        logger.error(e)
    }
    return dbInstance
}

mongodb()
