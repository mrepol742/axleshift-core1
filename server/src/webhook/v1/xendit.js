import express from 'express'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import { XENDIT_WEBHOOK_VERIFICATION_TOKEN } from '../../config.js'
import { run } from '../../utils/cmd.js'
import { send } from '../../components/mail.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const token = req.headers['x-callback-token']
        if (!token) return res.status(400).json({ error: 'Invalid request' })
        if (token !== XENDIT_WEBHOOK_VERIFICATION_TOKEN)
            return res.status(401).json({ error: 'Unauthorized' })

        const db = await database()
        db.collection('invoices').updateOne(
            { invoice_id: req.body.id },
            {
                $set: {
                    status: req.body.status,
                    payment_method: req.body.payment_method,
                    adjusted_amount: req.body.adjusted_received_amount,
                    updated_at: Date.now(),
                },
            },
        )

        if (req.body.status === "PAID") {
            db.collection('freight').updateOne(
                { invoice_id: req.body.id },
                {
                    $set: {
                        status: 'to_ship',
                        updated_at: Date.now(),
                    },
                },
            )
        }
        return res.status(200).send()
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
