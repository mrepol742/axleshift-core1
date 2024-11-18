import express from 'express'
import { Webhooks } from '@octokit/webhooks'
import database from '../../models/mongodb.js'
import logger from '../../components/logger.js'
import { GITHUB_WEBHOOK_SECRET } from '../../config.js'
import { run } from '../../components/cmd.js'

const webhooks = new Webhooks({
    secret: GITHUB_WEBHOOK_SECRET,
})

const router = express.Router()

router.post('/github', async (req, res) => {
    const signature = req.headers['x-hub-signature-256']
    const body = await req.text()

    if (!(await webhooks.verify(body, signature))) return res.status(401).send()

    const payload = req.body.payload
    if (payload && payload.ref && payload.ref === 'refs/heads/core1-backend')
        run('git pull origin core1-backend && npm run pm2:restart')
            .then((output) => console.log(output))
            .catch((error) => logger.error(error))

    return res.status(200).send()
})

export default router
