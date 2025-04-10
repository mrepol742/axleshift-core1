// THIS IS NOT FOR EXTERNAL USE
// THIS IS FOR INTERNAL USE ONLY
import { ObjectId } from 'mongodb'
import express from 'express'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import auth from '../../../middleware/auth.js'
import freight from '../../../middleware/freight.js'
import invoices from '../../../middleware/invoices.js'
import recaptcha from '../../../middleware/recaptcha.js'
import { NODE_ENV } from '../../../config.js'
import activity from '../../../components/activity.js'
import address from '../../../middleware/address.js'
import { send } from '../../../components/mail.js'
import redis, { setCache, getCache } from '../../../models/redis.js'

const router = express.Router()
const MIN_TOKEN_LENGTH = 10
const MAX_TOKEN_LENGTH = 100
/**
 * Get all webhooks
 */

router.get('/', auth, async (req, res, next) => {
    try {
        const webhooks = await getCache('webhooks')
        return res.status(200).json(webhooks)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Set webhooks
 */
router.post('/', [recaptcha, auth], async (req, res, next) => {
    try {
        const { WebhooksLocationList } = req.body
        for (const location of WebhooksLocationList) {
            const { url, token, action, checked } = location
            const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i
            if (!url) return res.status(200).json({ error: `URL cannot be empty` })
            if (!urlPattern.test(url)) return res.status(200).json({ error: `Invalid URL: ${url}` })
            if (!token) return res.status(200).json({ error: `Token cannot be empty` })
            if (token.length < MIN_TOKEN_LENGTH)
                return res
                    .status(200)
                    .json({ error: `Token is too short. Minimum length is ${MIN_TOKEN_LENGTH}` })
            if (token.length > MAX_TOKEN_LENGTH)
                return res
                    .status(200)
                    .json({ error: `Token is too long. Maximum length is ${MAX_TOKEN_LENGTH}` })
            if (!action) return res.status(200).json({ error: `Action cannot be empty` })
            if (!['all', 'invoices', 'documents', 'shipments'].includes(action))
                return res.status(200).json({ error: `Invalid action: ${action}` })
            if (checked && typeof checked !== 'boolean')
                return res.status(200).json({ error: `Checked must be a boolean` })
        }
        await setCache('webhooks', WebhooksLocationList)
        return res.status(200).json()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
