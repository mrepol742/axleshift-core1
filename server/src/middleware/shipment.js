import axios from 'axios'
import logger from '../components/logger.js'

const shipment = async (req, res, next) => {
    const { tracking_id } = req.body
    if (!tracking_id) return res.status(400).send()

    try {
        req.shipment = {}
        return next()
    } catch (err) {
        logger.error(err)
    }
    return res.status(401).send()
}

export default shipment
