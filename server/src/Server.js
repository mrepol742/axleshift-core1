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
import os from 'os'
import { execSync } from 'child_process'
import { getClientIp } from './components/ip.js'

const app = express()
const upload = multer()

app.use(cors())
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
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: ["'self'", 'https://memes.memedrop.io'],
            },
        },
    }),
)
app.use(upload.none())
app.use(express.json())
app.use(rateLimiter)
app.use(pinoHttp({ logger }))

app.get('/', (req, res) => {
    let commitHash = 'N/A'
    let branchName = 'N/A'
    try {
        commitHash = execSync('git rev-parse HEAD').toString().trim()
        branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
    } catch (error) {
        logger.error('Failed to get latest commit hash or branch name', error)
    }

    const systemInfo = `
        ${Quotes.getRandomQuote()} <br><br>
        Platform: ${os.platform()}
        Commit Hash: ${branchName} ${commitHash}
        Architecture: ${os.arch()}
        CPU Count: ${os.cpus().length}
        Free Memory: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB
        Total Memory: ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB
        Uptime: ${(os.uptime() / 60).toFixed(2)} minutes
        User Agent: ${req.headers['user-agent']}
        Cookie: ${req.headers.cookie}
        IP Address: ${getClientIp(req)}
        Authorization: ${req.headers['authorization']}

        <img src="https://memes.memedrop.io/production/RX41ZZXD1oJ2/source.gif" alt="funny smile" width="400" height="200">
    `
    res.send(`<pre>${systemInfo}</pre>`)
})
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

app.use((err, req, res, next) => res.status(500).json({ error: 'Internal server error' }))

if (NODE_ENV !== 'production')
    app.get('/debug-sentry', (req, res) => {
        throw new Error(
            "This is a test DON't PaNICCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        )
    })

export default app
