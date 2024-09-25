import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import pinoHttp from 'pino-http'
import multer from 'multer'
import auth from './routes/auth.js'
import freight from './routes/freight.js'
import track from './routes/track.js'
import threat from './routes/threat.js'
import logger from './logger.js'
import connectToDatabase from './models/db.js'

const app = express()
const upload = multer()
const port = 5050

process.on('SIGHUP', function () {
    process.exit(0)
})

process.on('SIGTERM', function () {
    process.exit(0)
})

process.on('SIGINT', function () {
    process.kill(process.pid)
    process.exit(0)
})

process.on('uncaughtException', (err, origin) => {
    logger.error(err)
})

process.on('unhandledRejection', (reason, promise) => {
    logger.error(reason)
})

process.on('beforeExit', (code) => {
    logger.info('Process before exit code ' + code)
})

app.use(upload.none())
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }))
app.use(express.json())
app.use(pinoHttp({ logger }))

app.use('/api/auth', auth)
app.use('/api/freight', freight)
app.use('/api/track', track)
app.use('/api/threat', threat)

app.use((err, req, res, next) => {
    logger.error(err)
    res.status(500).send('Internal Server Error')
})

app.get('/', (req, res) => {
    res.send('Freight Core 1')
})

app.listen(port, async () => {
    await connectToDatabase()
    logger.info(`Server running on port ${port}`)
})
