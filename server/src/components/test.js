import axios from 'axios'
import logger from './logger.js'

const test = async (port) => {
    try {
        logger.info(`checking: http://localhost:${port}`)
        const response = await axios.get(`http://localhost:${port}`)

        logger.info(`status: ${response.status} ${response.statusText}`)
        logger.info(`message: ${response.data}`)
    } catch (err) {
        logger.error(err)
    }
}

export default test
