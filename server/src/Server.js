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
import { NODE_ENV, EXT_EXPRESS_PORT } from './config.js'
import rateLimiter from './middleware/rateLimiter.js'
import sanitize from './middleware/sanitize.js'
import logger from './components/logger.js'
import APIv1 from './routes/v1/index.js'
import GithubWebhook from './webhook/v1/github.js'

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
app.use('/api/v1/', APIv1)
app.use('/webhook/v1/', GithubWebhook)
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
