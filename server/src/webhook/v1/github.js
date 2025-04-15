import express from 'express'
import crypto from 'crypto'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import { GITHUB_WEBHOOK_SECRET } from '../../config.js'
import { run } from '../../utils/cmd.js'
import { send } from '../../components/mail.js'
import { execSync } from 'child_process'

const router = express.Router()

const notify = async (deploymentStatus) => {
    const db = await database()
    const admins = await db
        .collection('users')
        .find({ role: 'super_admin' }, { projection: { email: 1 } })
        .toArray()
    if (!admins || admins.length === 0) return
    let commitHash = 'N/A'
    let branchName = 'N/A'
    try {
        commitHash = execSync('git rev-parse HEAD').toString().trim()
        branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
    } catch (error) {
        logger.error('Failed to get latest commit hash or branch name', error)
    }

    for (let i = 0; i < admins.length; i++) {
        const admin = admins[i];
        new Promise((resolve) => setTimeout(resolve, Math.random() * (10000 - 5000) + 5000))
        send(
            {
                to: admin.email,
                subject: deploymentStatus
                    ? 'Successfully deployed Axleshift'
                    : 'Failed to deploy Axleshift',
                text: deploymentStatus
                    ? `The following commit has been deployed <br>Branch: ${branchName} Commit: ${commitHash}.`
                    : `The following commit has failed to be deployed <br>Branch: ${branchName} Commit: ${commitHash}.`,
            },
            admin.email,
            true,
        )
    }
}

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
                .then((output) => notify(true))
                .catch((error) => notify(false))

        return res.status(200).send()
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
