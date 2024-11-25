import express from 'express'
import database from '../../models/mongodb.js'
import logger from '../../components/logger.js'
import { XENDIT_WEBHOOK_VERIFICATION_TOKEN } from '../../config.js'
import { run } from '../../components/cmd.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const token = req.headers['x-callback-token']
        if (!token) return res.status(400).send()
        if (token !== XENDIT_WEBHOOK_VERIFICATION_TOKEN) return res.status(401).send()

        const db = await database()
        db.collection('invoices').updateOne(
            { invoice_id: req.body.id },
            {
                $set: {
                    status: req.body.status,
                    payment_method: req.body.payment_method,
                    adjusted_amount: req.body.adjusted_received_amount,
                    updated_at: Date.now(),
                    modified_by: 'system',
                },
            },
        )
        return res.status(200).send()
    } catch (err) {
        logger.error(err)
    }
    res.status(500).send()
})

export default router
