import { ObjectId } from 'mongodb'
import express from 'express'
import { Xendit } from 'xendit-node'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import auth from '../../../middleware/auth.js'
import freight from '../../../middleware/freight.js'
import invoices from '../../../middleware/invoices.js'
import recaptcha from '../../../middleware/recaptcha.js'
import { NODE_ENV, AWS_BUCKET_NAME } from '../../../config.js'
import activity from '../../../components/activity.js'
import documents from '../../../middleware/documents.js'
import { upload, uploadToS3 } from '../../../components/s3/documents.js'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import s3 from '../../../models/s3.js'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import crypto from 'crypto'
import sendWebhook from '../../../utils/webhook.js'

const router = express.Router()
const limit = 20

/**
 * Get all documents
 */
router.post('/', auth, async (req, res) => {
    try {
        // if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
        const { page } = req.body
        if (!page) return res.status(400).json({ error: 'Invalid request' })
        const current_page = parseInt(page) || 1
        const skip = (current_page - 1) * limit
        const isUser = req.user ? !['super_admin', 'admin', 'staff'].includes(req.user.role) : null

        let filter = isUser ? { user_id: req.user._id } : {}
        const db = await database()
        const documentsCollection = db.collection('documents')

        const [totalItems, items] = await Promise.all([
            documentsCollection.countDocuments(filter),
            documentsCollection
                .find(filter)
                .sort({ last_accessed: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
        ])

        const data = {
            data: items,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: current_page,
        }

        return res.status(200).json(data)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Get address by ID
 */
router.get('/:id', [auth, documents], async (req, res) => res.status(200).json(req.documents))

/**
 * Upload a document
 */
router.post(
    '/:id/upload',
    [auth, documents, upload.fields([{ name: 'exportLicense' }, { name: 'certificateOfOrigin' }])],
    async (req, res) => {
        try {
            const { files } = req
            if (!files || !files.exportLicense || !files.certificateOfOrigin)
                return res.status(400).json({ error: 'Invalid request' })

            const exportLicenseFile = files.exportLicense[0]
            const certificateOfOriginFile = files.certificateOfOrigin[0]

            const [exportLicenseUrl, certificateOfOriginUrl] = await Promise.all([
                uploadToS3(
                    exportLicenseFile,
                    req.documents.documents && req.documents.documents[0].file
                        ? req.documents.documents[0].file
                        : crypto.randomBytes(6).toString('hex'),
                ),
                uploadToS3(
                    certificateOfOriginFile,
                    req.documents.documents && req.documents.documents[1].file
                        ? req.documents.documents[1].file
                        : crypto.randomBytes(6).toString('hex'),
                ),
            ])

            const db = await database()
            const documentsCollection = db.collection('documents')

            await documentsCollection.updateOne(
                { _id: new ObjectId(req.documents._id) },
                {
                    $set: {
                        'documents.$[exportLicense].file': exportLicenseUrl,
                        'documents.$[exportLicense].status': 'under_review',
                        'documents.$[certificateOfOrigin].file': certificateOfOriginUrl,
                        'documents.$[certificateOfOrigin].status': 'under_review',
                        updated_at: Date.now(),
                    },
                },
                {
                    arrayFilters: [
                        { 'exportLicense.name': 'Export License' },
                        { 'certificateOfOrigin.name': 'Certificate of Origin' },
                    ],
                },
            )

            Promise.all([
                (async () => {
                    const documents = documentsCollection.findOne({
                        _id: new ObjectId(req.documents._id),
                    })
                    if (documents) sendWebhook('documents', documents)
                })(),
            ])

            return res.status(200).json({
                data: [
                    {
                        name: 'Export License',
                        type: 'Permit & License',
                        status: 'under_review',
                        file: exportLicenseUrl,
                    },
                    {
                        name: 'Certificate of Origin',
                        type: 'Regulatory Certificate',
                        status: 'under_review',
                        file: certificateOfOriginUrl,
                    },
                    {
                        name: 'Bill of Lading',
                        type: 'Shipping Document',
                        status: 'generated',
                        file: {
                            ref: req.documents.freight_tracking_number,
                            file: `bill-of-lading-${req.documents.freight_tracking_number}.pdf`,
                        },
                    },
                ],
                message: 'Files uploaded successfully',
            })
        } catch (err) {
            logger.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }
    },
)

/**
 * Get file for preview
 */
router.post('/file/:id', [auth, documents], async (req, res) => {
    try {
        const { file } = req.body
        if (!file) return res.status(400).json({ error: 'Invalid request' })

        for (const document of req.documents.documents) {
            if (document.file && document.file.file === file) {
                const fileFormat = document.file.file.split('.').pop()
                const url = await getSignedUrl(
                    s3,
                    new GetObjectCommand({
                        Bucket: AWS_BUCKET_NAME,
                        Key: `files/${document.file.ref}.${fileFormat}`,
                    }),
                    { expiresIn: 60 * 5 },
                )
                return res.status(200).json({ url, fileFormat, file: document.file.file })
            }
        }
        return res.status(404).json({ error: 'File not found' })
    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

export default router
