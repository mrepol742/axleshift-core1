import express from 'express'
import { Xendit } from 'xendit-node'
import database from '../../models/mongodb.js'
import logger from '../../components/logger.js'
import auth from '../../middleware/auth.js'
import freight from '../../middleware/freight.js'
import recaptcha from '../../middleware/recaptcha.js'
import { XENDIT_API_GATEWAY_URL, XENDIT_API_KEY } from '../../config.js'

const { xendit } = new Xendit({
    secretKey: XENDIT_API_KEY,
    xenditURL: XENDIT_API_GATEWAY_URL,
})
const router = express.Router()

router.get('/', [auth], async (req, res) => {
    try {
        const db = await database()
        const response = await db
            .collection('payments')
            .find({ user_id: req.user._id })
            .sort({ last_accessed: -1 })
            .toArray()
        return res.status(200).send(response)
    } catch (err) {
        logger.error(err)
    }
    res.status(500).send()
})

router.post('/', [recaptcha, auth, freight], async (req, res) => {
    try {
        const invoice = await xendit.createInvoice({
            amount: req.freight.cost,
            invoiceDuration: 172800,
            externalId: 'core1-axleshift',
            description: req.freight.data.shipment.shipment_description,
            currency: req.user.currency,
            reminderTime: 1,
        })
        logger.info(invoice)
        return res.status(200).send()
    } catch (err) {
        logger.error(err)
    }
    res.status(500).send()
})

router.post('/cancel', [recaptcha, auth], async (req, res) => {
    try {
        const invoice_id = req.body.invoice_id
        if (!invoice_id) return res.status(400).send()

        return res.status(200).send()
    } catch (err) {
        logger.error(err)
    }
    res.status(500).send()
})

export default router
