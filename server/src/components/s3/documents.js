import multer from 'multer'
import { Upload } from '@aws-sdk/lib-storage'
import {
    AWS_BUCKET_NAME
} from '../../config.js'
import s3 from '../../models/s3.js'

const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        cb(null, true)
    },
})

const uploadToS3 = async (file, ref) => {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `files/${ref}.${fileExtension}`;

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
