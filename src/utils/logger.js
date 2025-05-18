import pino from 'pino'
import { NODE_ENV } from '../config.js'

const isProduction = NODE_ENV === 'production'

const prettyStream = pino.transport({
    target: 'pino-pretty',
    options: {
        colorize: true,
        singleLine: true,
        ignore: 'pid,hostname,req,res,responseTime',
        translateTime: 'yyyy-mm-dd HH:MM:ss.l',
        messageFormat: '{msg}{req.url} ................ ~ {responseTime}ms',
    },
})

const fileStream = pino.destination({
    dest: './logs/app.log',
    minLength: 4096,
    sync: false,
})

const streams = isProduction
    ? [{ stream: fileStream }]
    : [{ stream: prettyStream }, { stream: fileStream }]

const logger = pino(
    {
        level: isProduction ? 'info' : 'debug',
        formatters: {
            level(label) {
                return { level: label.toUpperCase() }
            },
        },
        serializers: {
            req(req) {
                const { id, ...rest } = req
                return {
                    method: rest.method,
                    url: rest.url,
                    headers: rest.headers,
                }
            },
            res(res) {
                return {
                    statusCode: res.statusCode,
                    responseTime: res.responseTime,
                }
            },
        },
        timestamp: pino.stdTimeFunctions.isoTime,
    },
    pino.multistream(streams),
)

export default logger
