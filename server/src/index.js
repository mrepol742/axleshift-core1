import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import { SENTRY_DNS, EXPRESS_PORT } from './config.js'

Sentry.init({
    dsn: SENTRY_DNS,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    disableInstrumentationWarnings: true,
})

import logger from './components/logger.js'
import app from './Server.js'
import db from './models/db.js'
import mail from './components/mail.js'
import cron from './components/cron.js'

process.on('uncaughtException', (err, origin) => {
    logger.error(err)
    //haysssssssssssssssssssssssssssssssssss
})

process.on('unhandledRejection', (reason, promise) => {
    logger.error(reason)
})

app.listen(EXPRESS_PORT, async (err) => {
    if (err) return logger.error('unable to start server', err)
    await Promise.all([db(), mail(), cron()])
    logger.info(`server running on port ${EXPRESS_PORT}`)
})

Sentry.setupExpressErrorHandler(app)
