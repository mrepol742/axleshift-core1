import cron from 'node-cron'
import sessionTask from '../tasks/sessions.js'
import otpTask from '../tasks/otp.js'
import logger from '../utils/logger.js'

const hour = '0 * * * *'

const _cron = () => {
    cron.schedule(hour, sessionTask).start()
    cron.schedule(hour, otpTask).start()
    logger.info('cron tasks started.')
}

export default _cron
