import express from 'express'
import crypto from 'crypto'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import { GITHUB_WEBHOOK_SECRET } from '../../config.js'
import { run } from '../../utils/cmd.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const github_signature = req.headers['x-hub-signature-256']
        if (!github_signature) return res.status(400).json({ error: 'Invalid request' })
        const hash =
            'sha256=' +
            crypto
                .createHmac('sha256', GITHUB_WEBHOOK_SECRET)
                .update(JSON.stringify(req.body))
                .digest('hex')

        if (hash !== github_signature) return res.status(401).json({ error: 'Unauthorized' })

        if (req.body.ref === 'refs/heads/core1-backend')
            run('git pull origin core1-backend && npm i && npm run pm2:restart')
                .then((output) => console.log(output))
                .catch((error) => logger.error(error))

        return res.status(200).send()
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
