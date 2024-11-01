import axios from 'axios'
import fs from 'fs'
import path from 'path'
import logger from './logger.js'

const download = (url, name) => {
    const savePath = path.join(process.cwd(), 'public', 'u', `${name}.png`)
    downloadImage(url, savePath)
        .then(() => {
            logger.info('Finished downloading user avatar.')
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
