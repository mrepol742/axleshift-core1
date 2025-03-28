import { ObjectId } from 'mongodb'
import { Xendit } from 'xendit-node'
import database from '../models/mongodb.js'
import logger from '../utils/logger.js'
import { XENDIT_API_GATEWAY_URL, XENDIT_API_KEY, NODE_ENV } from '../config.js'

const { Invoice } = new Xendit({
    secretKey: XENDIT_API_KEY,
    xenditURL: XENDIT_API_GATEWAY_URL,
})

const InvoiceGenerator = async (res, req, tracking_number) => {
      try {
        const db = await database()
        const freightCollection = db.collection('freight')
        const freight = await freightCollection.findOne({ tracking_number })
        if (!freight) return res.status(404).json({ error: 'Shipment not found' })
        req.freight = freight
        
        const invoiceCollection = db.collection('invoices')
        const invoice = await invoiceCollection.findOne({ freight_id: freight._id })
        if (invoice) return res.status(200).send({ r_url: `https://checkout-staging.xendit.co/web/${invoice.invoice_id}` })

        const redirectUrl =
            NODE_ENV !== 'production'
                ? `http://localhost:3000/shipment/${req.freight.tracking_number}`
                : `https://core1.axleshift.com/shipment/${req.freight.tracking_number}`

        const xenditInvoice = await Invoice.createInvoice({
            data: {
                amount: req.freight.amount.value,
                payerEmail: req.user.email,
                invoiceDuration: 172800,
                externalId: `core1-axleshift-${Date.now()}`,
                description: `Shipment #${req.freight.tracking_number}`,
                currency: 'PHP',
                reminderTime: 1,
                shouldSendEmail: true,
                failureRedirectUrl: redirectUrl,
                successRedirectUrl: redirectUrl,
            },
        })

        const dateNow = Date.now()
        const _invoice = await invoiceCollection.insertOne({
            user_id: req.user._id,
            freight_id: req.freight._id,
            freight_tracking_number: req.freight.tracking_number,
            invoice_id: xenditInvoice.id,
            invoice_external_id: xenditInvoice.externalId,
            amount: xenditInvoice.amount,
            status: xenditInvoice.status,
            currency: xenditInvoice.currency,
            session_id: req.session._id,
            created_at: dateNow,
            updated_at: dateNow,
        })

        await freightCollection.updateOne(
            { _id: new ObjectId(req.freight._id) },
            {
                $set: {
                    invoice_id: _invoice._id,
                    updated_at: dateNow,
                },
            },
        )
        return res.status(200).send({ r_url: xenditInvoice.invoiceUrl })
    } catch (err) {
        logger.error(err)
    }
    return res.status(500).json({ error: 'Internal server error' })
}

export default InvoiceGenerator
