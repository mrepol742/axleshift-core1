import axios from 'axios'
import fs from 'fs'
import path from 'path'
import logger from './logger.js'
import { uploadToS3 } from '../components/s3/profile.js'

const download = (url, ref) => {
    const tempDir = path.join(process.cwd(), 'temp')
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

    const savePath = path.join(tempDir, `${ref}.png`)
    downloadImage(url, savePath)
        .then(async () => {
            logger.info('Finished downloading user avatar.')
            const fileBuffer = fs.readFileSync(savePath)
            const file = {
                buffer: fileBuffer,
                originalname: `${ref}.png`,
                mimetype: 'image/png',
            }
            const location = await uploadToS3(file, ref)
            if (!location) return
            logger.info('Uploaded user avatar to S3.')
            fs.unlink(savePath, (err) => {
                if (err) {
                    logger.error(`Failed to delete file: ${err}`)
                } else {
                    logger.info('Deleted local file after upload.')
                }
            })
        })
        .catch((err) => {
            logger.error(err)
        })
}

const downloadImage = async (url, path) => {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    })

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(path)

        response.data.pipe(writer)

        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}

export default download
