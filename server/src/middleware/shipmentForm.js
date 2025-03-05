import axios from 'axios'
import logger from '../utils/logger.js'
import database from '../models/mongodb.js'

const ShipmentForm = async (req, res, next) => {
    const {
        _id,
        isImport,
        isResidentialAddress,
        containsDangerGoods,
        containsDocuments,
        from,
        to,
        type,
        items,
    } = req.body

    if (typeof isImport !== 'boolean') return res.status(400).send('Invalid value for isImport')
    if (typeof isResidentialAddress !== 'boolean')
        return res.status(400).send('Invalid value for isResidentialAddress')
    if (typeof containsDangerGoods !== 'boolean')
        return res.status(400).send('Invalid value for containsDangerGoods')
    if (typeof containsDocuments !== 'boolean')
        return res.status(400).send('Invalid value for containsDocuments')
    if (typeof from !== 'object' || from === null)
        return res.status(400).send('Invalid value for from')
    if (typeof to !== 'object' || to === null) return res.status(400).send('Invalid value for to')
    if (typeof type !== 'string' || !['private', 'business'].includes(type))
        return res.status(400).send('Invalid value for type')
    if (!Array.isArray(items)) return res.status(400).send('Invalid value for items')
    return next()
}

export default ShipmentForm
