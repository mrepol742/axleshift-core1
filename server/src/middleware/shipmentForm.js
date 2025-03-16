import axios from 'axios'
import logger from '../utils/logger.js'
import database from '../models/mongodb.js'

const ShipmentForm = async (req, res, next) => {
    const {
        _id,
        is_import,
        is_residential_address,
        contains_danger_goods,
        contains_documents,
        from,
        to,
        type,
        items,
    } = req.body
    if (typeof is_import !== 'boolean')
        return res.status(400).json({ error: 'Invalid value for Import Statement' })
    if (typeof is_residential_address !== 'boolean')
        return res.status(400).json({ error: 'Invalid value for Residential Address' })
    if (typeof contains_danger_goods !== 'boolean')
        return res.status(400).json({ error: 'Invalid value for Shipment contains danger goods' })
    if (typeof contains_documents !== 'boolean')
        return res.status(400).json({ error: 'Invalid value for Shipment contains documents' })
    if (typeof from !== 'object' || from === null)
        return res.status(400).json({ error: 'Invalid value for from' })
    if (typeof to !== 'object' || to === null)
        return res.status(400).json({ error: 'Invalid value for to' })
    if (typeof type !== 'string' || !['private', 'business'].includes(type))
        return res.status(400).json({ error: 'Invalid value for type' })
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Invalid value for items' })
    return next()
}

export default ShipmentForm
