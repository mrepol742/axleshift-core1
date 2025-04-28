import { ObjectId } from 'mongodb'
import express from 'express'
import { Xendit } from 'xendit-node'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import auth from '../../middleware/auth.js'
import freight from '../../middleware/freight.js'
import invoices from '../../middleware/invoices.js'
import recaptcha from '../../middleware/recaptcha.js'
import { XENDIT_API_GATEWAY_URL, XENDIT_API_KEY, NODE_ENV } from '../../config.js'
import activity from '../../components/activity.js'
import cache from '../../middleware/cache.js'
import { setCache } from '../../models/redis.js'
import { send } from '../../components/mail.js'
// import path from 'path'
// import fs from 'fs'
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
// import archiver from 'archiver-zip-encrypted'

const router = express.Router()
const limit = 20

/**
 * Get all Invoices
 */
router.post('/', [auth, cache], async (req, res) => {
    try {
        const { page } = req.body
        if (!page) return res.status(400).json({ error: 'Invalid request' })
        const current_page = parseInt(page) || 1
        const skip = (current_page - 1) * limit
        const isUser = req.user ? !['super_admin', 'admin', 'staff'].includes(req.user.role) : null

        const db = await database()
        const invoicesCollection = await db.collection('invoices')
        const filter = isUser ? { user_id: req.user._id } : {}
        const [totalItems, items] = await Promise.all([
            invoicesCollection.countDocuments({ ...filter, status: { $in: ['PAID', 'EXPIRED'] } }),
            invoicesCollection
            .find({ ...filter, status: { $in: ['PAID', 'EXPIRED'] } })
            .sort({ updated_at: -1 })
            .skip(skip)
            .limit(limit)
            .toArray(),
        ])

        const data = {
            data: items,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: current_page,
        }
        if (req.cacheKey) setCache(req.cacheKey, data, 30 * 60 * 1000)
        return res.sendGzipped(200, data)
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

// router.get('/download-invoice', async (req, res) => {
//   try {
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage([600, 400]);
//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

//     const drawText = (text, x, y, size = 12) => {
//       page.drawText(text, {
//         x,
//         y,
//         size,
//         font,
//         color: rgb(1, 1, 1),
//       });
//     };

//     // Background color
//     page.drawRectangle({
//       x: 0,
//       y: 0,
//       width: 600,
//       height: 400,
//       color: rgb(0.1, 0.12, 0.18),
//     });

//     // Invoice Content
//     drawText('AXLESHIFT', 250, 370, 20);
//     drawText('Invoice ID: 680b7bde652ef41a15438554', 30, 330);
//     drawText('Tracking Number: AX-1745583068115', 30, 310);
//     drawText('Name: Richard Anderson', 30, 290);
//     drawText('1600 Amphitheatre Parkway, Mountain View', 30, 270);
//     drawText('California 94043', 30, 255);
//     drawText('USA', 30, 240);
//     drawText('Date Paid: 4/25/2025, 8:12:15 PM', 30, 210);
//     drawText('Payment Method: EWALLET', 30, 190);
//     drawText('Amount Due: PHP 69,768.00', 30, 170, 14);

//     // Footer
//     drawText('This invoice has been issued to userEmail', 30, 60, 8);
//     drawText('In reference to shipment AX-1745583068115.', 30, 50, 8);
//     drawText('http://localhost:3000/invoices/AX-1745583068115', 30, 40, 8);

//     const passwordProtectedPdf = await pdfDoc.save();

//     await fs.promises.writeFile('./temp/invoice-protected.pdf', passwordProtectedPdf);

//     const filePath = path.resolve('./temp/invoice-protected.pdf')

//     const output = fs.createWriteStream(filePath);

//     const archive = archiver( {
//       zlib: { level: 9 },
//       encryptionMethod: 'aes256',
//       password: 'invoice2025', // Set ZIP password here
//     });

//     output.on('close', () => {
//       res.download(filePath, 'invoice.zip', (err) => {
//         if (err) console.error('Download error:', err);

//       });
//     });

//     archive.pipe(output);
//     archive.file(filePath, { name: 'invoice.pdf' });
//     archive.finalize();
//     res.download(filePath, 'invoice.zip');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Failed to generate invoice.');
//   }
// });

/**
 * Get Invoice by tracking number
 */
router.get('/:id', [auth], async (req, res) => {
    const id = req.params.id
        ? /^[A-Z]{2}-\d+$/.test(req.params.id)
            ? req.params.id
            : req.body.id
        : req.body.id
    if (!id) return res.status(400).json({ error: 'Invalid request' })

    try {
        const db = await database()
        const invoicesCollection = db.collection('invoices')
        const invoice = await invoicesCollection
            .aggregate([
            {
                $match: {
                freight_tracking_number: id,
                status: 'PAID',
                },
            },
            {
                $lookup: {
                from: 'freight',
                localField: 'freight_tracking_number',
                foreignField: 'tracking_number',
                as: 'freight_details',
                },
            },
            { $unwind: { path: '$freight_details', preserveNullAndEmptyArrays: true } },
            ])
            .next()

        if (!invoice)
            return res
                .status(404)
                .json({ error: 'Shipment invoice not found', tracking_number: id })

        return res.status(200).json(invoice)
    } catch (err) {
        logger.error(err)
    }
    res.status(400).json({ error: 'Invalid request' })
})

/* WARNING CREATE HAS BEEN REMOVED */
/* WARNING UPDATE HAS BEEN REMOVED */

/**
 * Cancel an Invoice
 */
router.post('/cancel', [recaptcha, auth, invoices], async (req, res) => {
    try {
        const db = await database()
        await db.collection('invoices').updateOne(
            { _id: new ObjectId(req.invoice._id) },
            {
                $set: {
                    status: 'CANCELLED',
                    updated_at: Date.now(),
                },
            },
        )
        activity(req, `cancelled invoice #${req.invoice._id}`)
        return res.status(200).send()
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
