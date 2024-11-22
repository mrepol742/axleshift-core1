import express from 'express'
import database from '../../models/mongodb.js'
import logger from '../../components/logger.js'
import { XENDIT_WEBHOOK_VERIFICATION_TOKEN } from '../../config.js'
import { run } from '../../components/cmd.js'

const router = express.Router()

router.post('/xendit', async (req, res) => {
    const token = req.headers['X-CALLBACK-TOKEN']
    if (!token || token !== XENDIT_WEBHOOK_VERIFICATION_TOKEN) return res.status(401).send()
    logger.info(req.body)
    res.status(500).send()
})

export default router
