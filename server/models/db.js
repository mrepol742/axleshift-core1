import dotenv from 'dotenv'
dotenv.config()
import fs from 'fs'
import logger from '../logger.js'
import { MongoClient } from 'mongodb'
import bcryptjs from 'bcryptjs'

const data = JSON.parse(fs.readFileSync(import.meta.dirname + '/users.json', 'utf8')).docs
let dbInstance = null

async function connectToDatabase() {
    if (dbInstance) return dbInstance

    const client = new MongoClient(process.env.MONGO_URL)

    await client.connect()
    await updatePasswordHash();
    
    logger.info('Connected successfully to server')

    dbInstance = client.db(process.env.MONGO_DB)

     const collection = dbInstance.collection('users')
     let cursor = await collection.find({})
     let documents = await cursor.toArray()

     if (documents.length == 0) {
         const insertResult = await collection.insertMany(data)
         logger.info('Inserted documents: ' + insertResult.insertedCount)
     } 

    return dbInstance
}

async function updatePasswordHash() {
    for (const element of data) { 
        element.password = await bcryptjs.hash(element.password, process.env.BCRYPT_SECRET);
    }
}

updatePasswordHash();

export default connectToDatabase
