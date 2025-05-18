import multer from 'multer'
import { Upload } from '@aws-sdk/lib-storage'
import { AWS_BUCKET_NAME } from '../../config.js'
import s3 from '../../models/s3.js'

const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only images are allowed!'), false)
        }
        cb(null, true)
    },
})

/**
 * Uploads a file to S3 and return a location.
 *
 * @param {Object} file
 * @param {String} ref
 * @return {Promise<Object>}
 */
const uploadToS3 = async (file, ref) => {
    const fileName = `images/${ref}.png`

    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    }

    const upload = new Upload({
        client: s3,
        params: uploadParams,
    })

    const result = await upload.done()
    return result.Location
}

export { upload, uploadToS3 }
