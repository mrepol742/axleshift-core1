import { ObjectId } from 'mongodb'
import database from '../models/mongodb.js'
import logger from '../utils/logger.js'
import Xendit from '../models/xendit.js'
import sendWebhook from '../utils/webhook.js'
import { NODE_ENV } from '../config.js'

/**
 * Generates an invoice for a shipment.
 *
 * @param {Object} res
 * @param {Object} req
 * @param {string} tracking_number
 * @return {Promise<void>}
 */
const InvoiceGenerator = async (res, req, tracking_number) => {
    try {
        const db = await database()
        const freightCollection = db.collection('freight')
        const invoiceCollection = db.collection('invoices')

        const [freight, invoice] = await Promise.all([
            freightCollection.findOne({ tracking_number }),
            invoiceCollection.findOne({ freight_tracking_number: tracking_number }),
        ])

        if (!freight) return res.status(404).json({ error: 'Shipment not found' })

        // redirect to orignal invoice if it exists
        // if its expired itll create new one
        if (invoice?.status === 'PENDING' || invoice?.status === 'PAID')
            return res
                .status(200)
                .send({ r_url: `https://checkout-staging.xendit.co/web/${invoice.invoice_id}` })

        const redirectUrl =
            NODE_ENV !== 'production'
                ? `http://localhost:3000/shipment/${freight.tracking_number}`
                : `https://core1.axleshift.com/shipment/${freight.tracking_number}`

        const payerEmail = freight.is_import ? freight.to[0].email : freight.from[0].email

        const Invoice = await Xendit()
        const xenditInvoice = await Invoice.createInvoice({
            data: {
                amount: freight.amount.value,
                payerEmail: payerEmail,
                invoiceDuration: 172800,
                externalId: `axleshift-${Date.now()}`,
                description: `Shipment #${freight.tracking_number}`,
                currency: 'PHP',
                reminderTime: 1,
                shouldSendEmail: true,
                failureRedirectUrl: redirectUrl,
                successRedirectUrl: redirectUrl,
            },
        })

        const dateNow = Date.now()
        const payload = {
            user_id: req.user._id,
            freight_tracking_number: freight.tracking_number,
            invoice_id: xenditInvoice.id,
            invoice_external_id: xenditInvoice.externalId,
            amount: xenditInvoice.amount,
            status: xenditInvoice.status,
            currency: xenditInvoice.currency,
            session_id: req.session._id,
            created_at: dateNow,
            updated_at: dateNow,
        }
        await Promise.all([
            invoiceCollection.insertOne(payload),
            freightCollection.updateOne(
                { _id: new ObjectId(freight._id) },
                {
                    $set: {
                        invoice_id: xenditInvoice.id,
                        updated_at: dateNow,
                    },
                },
            ),
            sendWebhook('shipments', { action: 'create', ...freight }),
            sendWebhook('invoices', { action: 'create', ...payload }),
        ])

        logger.info(freight.is_import ? 'Import' : 'Export')
        logger.info(payerEmail)
        if (freight.is_import) return res.status(200).send({ r_url: redirectUrl })
        return res.status(200).send({ r_url: xenditInvoice.invoiceUrl })
    } catch (err) {
        logger.error(err)
    }
    return res.status(500).json({ error: 'Internal server error' })
}

export default InvoiceGenerator
