import { ObjectId } from 'mongodb'
import express from 'express'
import { Xendit } from 'xendit-node'
import database from '../../models/mongodb.js'
import logger from '../../components/logger.js'
import auth from '../../middleware/auth.js'
import freight from '../../middleware/freight.js'
import invoices from '../../middleware/invoices.js'
import recaptcha from '../../middleware/recaptcha.js'
import { XENDIT_API_GATEWAY_URL, XENDIT_API_KEY } from '../../config.js'
import activity from '../../components/activity.js'

const { Invoice } = new Xendit({
    secretKey: XENDIT_API_KEY,
    xenditURL: XENDIT_API_GATEWAY_URL,
})
const router = express.Router()

router.get('/', [auth], async (req, res) => {
    try {
        const db = await database()
        const response = await db
            .collection('invoices')
            .find({ user_id: req.user._id })
            .sort({ updated_at: -1 })
            .toArray()
        return res.status(200).send(response)
    } catch (err) {
        logger.error(err)
    }
    res.status(500).send()
})

router.post('/', [recaptcha, auth, freight, invoices], async (req, res) => {
    try {
        if (req.invoice)
            return res
                .status(200)
                .send({ r_url: `https://checkout-staging.xendit.co/web/${req.invoice.invoice_id}` })
        const invoice = await Invoice.createInvoice({
            data: {
                amount: 24463,
                invoiceDuration: 172800,
                externalId: `core1-axleshift-${Date.now()}`,
                description: req.freight.data.shipment.shipment_description,
                currency: 'PHP',
                reminderTime: 1,
                shouldSendEmail: true,
            },
        })

        const db = await database()
        const invoicesCollection = db.collection('invoices')
        const _invoice = await invoicesCollection.insertOne({
            user_id: req.user._id,
            freight_id: req.freight._id,
            invoice_id: invoice.id,
            external_id: invoice.externalId,
            session_id: req.session._id,
            amount: invoice.amount,
            status: invoice.status,
            currency: invoice.currency,
            created_at: Date.now(),
            updated_at: Date.now(),
        })
        await db.collection('freight').updateOne(
            { _id: new ObjectId(req.freight._id) },
            {
                $set: {
                    invoice_id: _invoice._id,
                    updated_at: Date.now(),
                    modified_by: 'system',
                },
            },
        )

        activity(req, `create invoice for shipment #${req.freight._id} with invoice id #${_invoice._id}`)
        return res.status(200).send({ r_url: invoice.invoiceUrl })
    } catch (err) {
        logger.error(err)
    }
    res.status(500).send()
})

router.post('/cancel', [recaptcha, auth, invoices], async (req, res) => {
    try {

        activity(req, `canceled invoice #${req.invoice._id}`)
        return res.status(200).send()
    } catch (err) {
        logger.error(err)
    }
    res.status(500).send()
})

export default router
