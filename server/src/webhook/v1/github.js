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
    try {
        if (!(await webhooks.verify(req.body.toString(), req.headers['x-hub-signature-256'])))
            return res.status(401).send()

        if (req.body.ref === 'refs/heads/core1-backend')
            run('git pull origin core1-backend && npm i && npm run pm2:restart')
                .then((output) => console.log(output))
                .catch((error) => logger.error(error))

        return res.status(200).send()
    } catch (err) {
        logger.error(err)
    }
    res.status(500).send()
})

export default router
