import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import * as config from './config.js'
import logger from './utils/logger.js'
import app from './Server.js'
import db from './models/mongodb.js'
import mail from './components/mail.js'
import cron from './components/cron.js'
import redis, { clearRedisCache } from './models/redis.js'

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
    if (config.NODE_ENV === 'production') Sentry.setupExpressErrorHandler(app)

    Object.entries(config).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            if (config.NODE_ENV === 'production') {
                logger.error(`The value for ${key} is empty.`)
            } else {
                logger.warn(`The value for ${key} is empty.`)
            }
        }
    })

    app.listen(config.EXPRESS_PORT, async (err) => {
        if (err) return logger.error(err)
        logger.info(`server running on port ${config.EXPRESS_PORT}`)
        await Promise.all([db(), mail(), cron(), redis()])
    })
}

startServer()
