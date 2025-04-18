import express from 'express'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import { XENDIT_WEBHOOK_VERIFICATION_TOKEN } from '../../config.js'
import { run } from '../../utils/cmd.js'
import { send } from '../../components/mail.js'
import sendWebhook from '../../utils/webhook.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const token = req.headers['x-callback-token']
        if (!token) return res.status(400).json({ error: 'Invalid request' })
        if (token !== XENDIT_WEBHOOK_VERIFICATION_TOKEN)
            return res.status(401).json({ error: 'Unauthorized' })

        const db = await database()
        const payload = {
            status: req.body.status,
            payment_method: req.body.payment_method,
            adjusted_amount: req.body.adjusted_received_amount,
            updated_at: Date.now(),
        }
        Promise.all([
            db.collection('invoices').updateOne(
                { invoice_id: req.body.id },
                {
                    $set: payload,
                },
            ),
            (async () => {
                if (req.body.status === 'PAID') {
                    const freightCollection = db.collection('freight')
                    const freight = await freightCollection.findOne({ invoice_id: req.body.id })
                    const dateNow = new Date()

                    const result = await db.collection('documents').insertOne({
                        user_id: freight.user_id,
                        freight_tracking_number: freight.tracking_number,
                        session_id: freight.session_id,
                        documents: [
                            {
                                name: 'Bill of Lading',
                                type: 'Shipping Document',
                                status: 'generated',
                                file: {
                                    ref: freight.tracking_number,
                                    file: `bill-of-lading-${freight.tracking_number}.pdf`,
                                },
                            },
                            {
                                name: 'Export License',
                                type: 'Permit & License',
                                status: 'not_applicable',
                            },
                            {
                                name: 'Certificate of Origin',
                                type: 'Regulatory Certificate',
                                status: 'not_applicable',
                            },
                        ],
                        created_at: dateNow,
                        updated_at: dateNow,
                    })

                    db.collection('freight').updateOne(
                        { invoice_id: req.body.id },
                        {
                            $set: {
                                documents_id: result.insertedId,
                                status: 'to_ship',
                                updated_at: Date.now(),
                            },
                        },
                    )
                }
            })(),
            sendWebhook('invoices', { action: 'update', invoice_id: req.body.id, ...payload }),
        ])

        return res.status(200).send()
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
