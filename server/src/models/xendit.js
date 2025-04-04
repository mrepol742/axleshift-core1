import { Xendit } from 'xendit-node'
import logger from '../utils/logger.js'
import { XENDIT_API_GATEWAY_URL, XENDIT_API_KEY, NODE_ENV } from '../config.js'

let xenditInstance = null

const xendit = async () => {
    if (xenditInstance) return xenditInstance

    try {
        const { Invoice } = new Xendit({
            secretKey: XENDIT_API_KEY,
            xenditURL: XENDIT_API_GATEWAY_URL,
        })
        xenditInstance = Invoice
    } catch (e) {
        logger.error(e)
    }
    return xenditInstance
}

export default xendit