import dotenv from 'dotenv'
dotenv.config()
import crypto from 'crypto'
import express from 'express'
import axios from 'axios'

const app = express()
const port = process.env.APP_EXPRESS_PORT || 3000

app.get('/', async (req, res) => res.send('Hello, world: WHAT RE YOU DOIN HERE?'))

app.post('/webhook/v1/github', async (req, res) => {
    try {
        const github_signature = req.headers['x-hub-signature-256']
        if (!github_signature) return res.status(400).json({ error: 'Invalid request' })
        const hash = 'sha256=' + crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
        .update(JSON.stringify(req.body))
        .digest('hex');

        if (hash !== github_signature)
            return res.status(401).json({ error: 'Unauthorized' })

        if (req.body.ref === 'refs/heads/core1-frontend')
            run('cd public_html && git pull origin core1-frontend')
                .then((output) => console.log(output))
                .catch((error) => console.error(error))

        return res.status(200).send()
    } catch (err) {
        console.error(err)
    }
    res.status(500).json({ error: 'Internal server error'})
})

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));