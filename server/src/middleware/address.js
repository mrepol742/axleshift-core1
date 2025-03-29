import axios from 'axios'
import { ObjectId } from 'mongodb'
import logger from '../utils/logger.js'
import database from '../models/mongodb.js'

const Address = async (req, res, next) => {
    const id = req.params.id
        ? /^[A-Z]{2}-\d+$/.test(req.params.id)
            ? req.params.id
            : req.body._id
        : req.body._id
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
