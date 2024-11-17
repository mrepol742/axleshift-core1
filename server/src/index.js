import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import * as config from './config.js'

Sentry.init({
    dsn: config.SENTRY_DNS,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    disableInstrumentationWarnings: true,
})

import logger from './components/logger.js'
import app from './Server.js'
import db from './models/mongodb.js'
import mail from './components/mail.js'
import cron from './components/cron.js'
import test from './components/test.js'
import gemini from './models/gemini.js'

process.on('uncaughtException', (err, origin) => logger.error(err))

process.on('unhandledRejection', (reason, promise) => logger.error(reason))

app.listen(config.EXPRESS_PORT, async (err) => {
    if (err) return logger.error(err)
    logger.info(`server running on port ${config.EXPRESS_PORT}`)
    await Promise.all([db(), mail(), cron(), test(config.EXPRESS_PORT)])
})

for (const key in config) {
    const value = config[key]
    if (value === undefined || value === null || value === '') {
        logger.warn(`The value for ${key} is empty.`)
    }
}

Sentry.setupExpressErrorHandler(app)
