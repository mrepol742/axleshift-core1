import cron from 'node-cron'
import logger from '../utils/logger.js'

const hour = '0 * * * *'

const _cron = () => {
    logger.info('cron tasks started.')
}

export default _cron
