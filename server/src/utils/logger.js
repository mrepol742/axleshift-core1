import pino from 'pino'
import { NODE_ENV } from '../config.js'

const isProduction = NODE_ENV === 'production'

const logger = pino({
    level: isProduction ? 'info' : 'debug',
    formatters: {
        level(label) {
            return { level: label.toUpperCase() }
        },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: !isProduction
        ? {
              target: 'pino-pretty',
              options: {
                  colorize: true,
                  singleLine: true, 
                  ignore: 'pid,hostname',
                  translateTime: 'yyyy-mm-dd HH:MM:ss.l',
              },
          }
        : undefined,
})

export default logger
