import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import multer from 'multer'
import { Upload } from '@aws-sdk/lib-storage'
import {
    AWS_BUCKET_NAME,
    AWS_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
} from '../../config.js'

const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
})

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
