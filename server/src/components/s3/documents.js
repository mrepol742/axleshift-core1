import multer from 'multer'
import { Upload } from '@aws-sdk/lib-storage'
import { AWS_BUCKET_NAME } from '../../config.js'
import s3 from '../../models/s3.js'

const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        cb(null, true)
    },
})

/**
 * Uploads a file to S3 and returns the reference and file name.
 *
 * @param {Object} file
 * @param {String} ref
 * @return {Promise<Object>}
 */
const uploadToS3 = async (file, ref) => {
    const fileExtension = file.originalname.split('.').pop()
    const fileName = `${ref}.${fileExtension}`

    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: `files/${fileName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    }

    const upload = new Upload({
        client: s3,
        params: uploadParams,
    })

    await upload.done()
    return { ref, file: file.originalname }
}

export { upload, uploadToS3 }
