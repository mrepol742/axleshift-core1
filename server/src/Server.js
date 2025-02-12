import express from 'express'
import cors from 'cors'
import path from 'path'
import pinoHttp from 'pino-http'
import multer from 'multer'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import compression from 'compression'
import { createProxyMiddleware } from 'http-proxy-middleware'
import Quotes from 'inspirational-quotes'
import { NODE_ENV, EXT_EXPRESS_PORT, EXT_EXPRESS_PORT_1 } from './config.js'
import rateLimiter from './middleware/rateLimiter.js'
import sanitize from './middleware/sanitize.js'
import logger from './utils/logger.js'
import APIv1 from './routes/v1/index.js'
import Webhookv1 from './webhook/v1/index.js'

const app = express()
const upload = multer()

app.use(cors())
app.use(
    '/api/pmz',
    createProxyMiddleware({
        target: `http://localhost:${EXT_EXPRESS_PORT}`,
        changeOrigin: true,
        pathRewrite: {
            '^/api/pmz': '',
        },
    }),
)
app.use(
    '/frontend/webhook',
    createProxyMiddleware({
        target: `http://localhost:${EXT_EXPRESS_PORT_1}`,
        changeOrigin: true,
        pathRewrite: {
            '^/frontend/webhook': '',
        },
    }),
)
app.use(compression())
app.use(
    mongoSanitize({
        onSanitize: ({ req, key }) => {
            logger.warn(`this request[${key}] is sanitized`)
            logger.warn(req)
        },
    }),
)
app.use(sanitize)
app.use(helmet())
app.use(upload.none())
app.use(express.json())
app.use(rateLimiter)
app.use(pinoHttp({ logger }))

app.get('/', (req, res) => res.send(Quotes.getRandomQuote()))
// refer to /routes/v1/index
app.use('/api/v1/', APIv1)
// refer to /webhook/v1/index
app.use('/webhook/v1/', Webhookv1)

app.use(
    express.static(path.join(process.cwd(), 'public'), {
        setHeaders: function (res, filePath) {
            res.setHeader('Cache-Control', 'public, max-age=1296000')
        },
    }),
)

app.use((err, req, res, next) => res.status(500).send())

if (NODE_ENV !== 'production')
    app.get('/debug-sentry', (req, res) => {
        throw new Error(
            "This is a test DON't PaNICCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        )
    })

export default app
