import axios from 'axios'
import logger from '../utils/logger.js'
import database from '../models/mongodb.js'

const freight = async (req, res, next) => {
    const id = req.params.id ? req.params.id : req.body.id
    if (!id) return res.status(400).json({ error: 'Invalid request' })

    try {
        const db = await database()

        const freightCollection = db.collection('freight')

        const _freight = await freightCollection.findOne({ tracking_number: id })
        if (!_freight)
            return res.status(404).json({ error: 'Shipment not found', tracking_number: id })

        req.freight = _freight
        return next()
    } catch (err) {
        logger.error(err)
    }
    res.status(400).json({ error: 'Invalid request' })
}

export default freight
