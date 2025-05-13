import axios from 'axios'
import { ObjectId } from 'mongodb'
import logger from '../utils/logger.js'
import database from '../models/mongodb.js'

/**
 * Verify if the supply invoice id exists.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {Promise<void>}
 */
const invoices = async (req, res, next) => {
    const id = req.params.id ? req.params.id : req.body.id
    if (!id) return res.status(400).json({ error: 'Invalid request' })

    try {
        const db = await database()
        const invoicesCollection = db.collection('invoices')
        req.invoice = await invoicesCollection.findOne(
            {
                $or: [{ freight_id: id }, { freight_tracking_number: id }],
            },
            { projection: { invoice_id: 1 } },
        )
        return next()
    } catch (err) {
        logger.error(err)
    }
    res.status(400).json({ error: 'Invalid request' })
}

export default invoices
