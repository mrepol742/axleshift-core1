import express from 'express'
import cors from 'cors'
import pinoHttp from 'pino-http'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import compression from 'compression'
import { NODE_ENV, REACT_APP_URL } from './config.js'
import rateLimiter from './middleware/rateLimiter.js'
import logger from './utils/logger.js'
import APIv1 from './routes/v1/index.js'
import Webhookv1 from './webhook/v1/index.js'
import IPAddressFilter from './middleware/ip.js'
import gzip from './middleware/gzip.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(mongoSanitize())
app.use(compression())
app.use(rateLimiter)
app.use(IPAddressFilter)
app.use(gzip)
app.use(pinoHttp({ logger }))

app.get('/', (req, res) => res.redirect(301, REACT_APP_URL))
// refer to /routes/v1/index
app.use('/api/v1/', APIv1)
// refer to /webhook/v1/index
app.use('/webhook/v1/', Webhookv1)

app.use((err, req, res, next) => res.status(500).json({ error: 'Internal server erroraa' }))

if (NODE_ENV !== 'production')
    app.get('/debug-sentry', (req, res) => {
        throw new Error(
            "This is a test DON't PaNICCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        )
    })

export default app
