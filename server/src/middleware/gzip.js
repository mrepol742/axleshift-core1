import zlib from 'zlib'
import logger from '../utils/logger.js'

const gzip = (req, res, next) => {
    const originalSend = res.send.bind(res)

    res.sendGzipped = function (status, data) {
        if (!req.headers['accept-encoding'] || !req.headers['accept-encoding'].includes('gzip'))
            return res.status(status).send(data)

        const body = typeof data === 'object' ? JSON.stringify(data) : String(data)

        zlib.gzip(body, (err, compressedData) => {
            if (err) {
                logger.error('Gzip compression error:', err)
                return res.status(status).send(data)
            }

            res.set({
                'Content-Type': 'application/json',
                'Content-Encoding': 'gzip',
                'Content-Length': compressedData.length,
            })

            originalSend(compressedData)
        })
    }

    next()
}

export default gzip
