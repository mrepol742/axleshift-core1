import axios from 'axios'
import logger from '../utils/logger.js'

const IPAddressFilter = async (req, res, next) => {
    try {
        next()
    } catch (err) {
        logger.error(err)
    }
    res.status(400).json({ error: 'Invalid request' })
}

export default IPAddressFilter
