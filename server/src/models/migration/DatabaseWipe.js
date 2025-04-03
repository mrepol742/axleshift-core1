import readline from 'readline'
import crypto from 'crypto'
import Database from '../mongodb.js'
import { APP_KEY, NODE_ENV } from '../../config.js'

const DatabaseWipe = async () => {
    if (NODE_ENV !== 'production') return wipe()
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    rl.question('You are in production mode. Do you want to continue? (y/n) ', async (answer) => {
        if (answer.toLowerCase() !== 'y') {
            console.log('Exiting...')
            process.exit(0)
        }
        rl.close()

        wipe()
    })
}

const wipe = async () => {
    const db = await Database()
    const freightCollection = db.collection('freight')
    const invoicesCollection = db.collection('invoices')
    const documentsCollection = db.collection('documents')

    await freightCollection.deleteMany({})
    await invoicesCollection.deleteMany({})
    await documentsCollection.deleteMany({})

    console.log('All collections have been wiped.')
    process.exit(0)
}

DatabaseWipe()
