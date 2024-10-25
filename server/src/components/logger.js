import pino from 'pino'
import { NODE_ENV } from '../config.js'

let logger

if (NODE_ENV !== 'production') {
    logger = pino({
        level: 'debug',
        transport: {
            target: 'pino-pretty',
        },
    })
} else {
    logger = pino()
}

export default logger
