import axios from 'axios'
import { ObjectId } from 'mongodb'
import logger from '../utils/logger.js'
import database from '../models/mongodb.js'

/**
 * Verify if the supply address id exists.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {Promise<void>}
 */
const Address = async (req, res, next) => {
    const id = req.params.id ? req.params.id : req.body.id
    if (!id) return res.status(400).json({ error: 'Invalid request' })

    try {
        const db = await database()

        const addressesCollection = db.collection('addresses')

        const address = await addressesCollection.findOne({ _id: new ObjectId(id) })
        if (!address) return res.status(404).json({ error: 'Address not found', id: id })

        req.address = address
        return next()
    } catch (err) {
        logger.error(err)
    }
    res.status(400).json({ error: 'Invalid request' })
}

export default Address
