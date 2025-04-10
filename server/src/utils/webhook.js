import axios from 'axios'
import { getCache } from '../models/redis.js'
import logger from './logger.js'

const sendWebhook = async (action, data) => {
    const webhooks = await getCache('webhooks')
    if (!webhooks) return

    const getWebhooks = webhooks.find((webhook) => webhook.action === action)
    if (!getWebhooks) return
 
    for (const webhook of getWebhooks.urls) {
        const { url, token } = webhook;
        const payload = {
           token, data
        }

        try {
            const response = await axios.post(url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status < 200 || response.status >= 300) 
                logger.info('Failed sending webhook' + response.status + ' ' + response.statusText)
        } catch (error) {
            logger.error(error)
        }
    }
}

export default sendWebhook