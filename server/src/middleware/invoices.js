import axios from 'axios'
import { ObjectId } from 'mongodb'
import logger from '../utils/logger.js'
import database from '../models/mongodb.js'

const invoices = async (req, res, next) => {
    const id = /^\/[a-fA-F0-9]{24}$/.test(req.path) ? req.params.id : req.body.id
    if (!id) return res.status(400).json({ error: 'Invalid request' })

    try {
        const db = await database()
        const invoicesCollection = db.collection('invoices')
        req.invoice = await invoicesCollection.findOne({ freight_id: new ObjectId(id) })
        return next()
    } catch (err) {
        logger.error(err)
    }
    res.status(400).json({ error: 'Invalid request' })
}

export default invoices
