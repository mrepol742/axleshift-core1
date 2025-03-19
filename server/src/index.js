import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import chokidar from 'chokidar'
import * as config from './config.js'
import logger from './utils/logger.js'
import app from './Server.js'
import db from './models/mongodb.js'
import mail from './components/mail.js'
import cron from './components/cron.js'
import redis from './models/redis.js'

if (config.NODE_ENV === 'production')
    Sentry.init({
        dsn: config.SENTRY_DNS,
        integrations: [nodeProfilingIntegration()],
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
        disableInstrumentationWarnings: true,
    })

process.on('uncaughtException', (err, origin) => logger.error(err))
process.on('unhandledRejection', (reason, promise) => logger.error(reason))

const startServer = async () => {
    app.listen(config.EXPRESS_PORT, async (err) => {
        if (err) return logger.error(err)
        logger.info(`server running on port ${config.EXPRESS_PORT}`)
        await Promise.all([db(), mail(), cron(), redis()])
    })
}

for (const key in config) {
    const value = config[key]
    if (value === undefined || value === null || value === '') {
        logger.warn(`The value for ${key} is empty.`)
    }
}

if (config.NODE_ENV === 'production') Sentry.setupExpressErrorHandler(app)

startServer()
