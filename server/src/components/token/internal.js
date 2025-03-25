import { ObjectId } from 'mongodb'
import crypto from 'crypto'
import logger from '../../utils/logger.js'
import { getUser, getSession, removeSession } from '../sessions.js'
import database from '../../models/mongodb.js'
import { REACT_APP_ORIGIN } from '../../config.js'
import { setCache } from '../../models/redis.js'
import sendOTP from '../otp.js'
import { getCache } from '../../models/redis.js'

const adminRoute = ['/metrics/v1/prometheus', '/api/v1/sec/management']
const knownClients = [
    'PostmanRuntime',
    'axios',
    'curl',
    'wget',
    'httpclient',
    'python-requests',
    'okhttp',
    'Go-http-client',
    'Java',
    'Puppeteer',
    'HeadlessChrome',
    'PhantomJS',
    'Selenium',
]

const internal = async (req, res, next) => {
    if (REACT_APP_ORIGIN !== req.socket.remoteAddress)
        return res.status(401).json({ error: 'Unauthorized' })

    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]

    const [theUser, session] = await Promise.all([getUser(token), getSession(req, token)])

    if (!theUser || (adminRoute.includes(req.path) && theUser.role !== 'admin'))
        return res.status(401).json({ error: 'Unauthorized' })

    if (!session || !session.active) return res.status(401).json({ error: 'Unauthorized' })
    // const encryptedData = req.body.data
    // const decryptedData = crypto.privateDecrypt({
    //     key: session.key.privateKey, padding: crypto.constants.RSA_PKCS1_PADDING
    // }, Buffer.from(encryptedData, 'base64'))

    // req.body.data = JSON.parse(decryptedData.toString())
    const userAgent = req.headers['user-agent'] || ''
    const accept = req.headers['accept'] || ''
    const secFetch = req.headers['sec-fetch-mode'] || ''

    if (
        knownClients.some((bot) => userAgent.includes(bot)) ||
        !accept.includes('application/json') ||
        !secFetch
    ) {
        removeSession(session.token)
        return res.status(401).json({ error: 'Unauthorized' })
    }

    req.request_type = 'internal'
    req.token = token
    req.user = theUser
    req.session = session

    if (!theUser.email_verify_at) {
        if (req.path === '/otp' || req.path === '/otp/new') return next()
        const theOtp = await getCache(`user-id-${req.user._id.toString()}`)
        if (!theOtp) sendOTP(req)
        return res
            .status(200)
            .json({ otp: true, email: req.user.email, message: 'OTP sent to your email' })
    }

    return next()
}

export default internal
