import { ObjectId } from 'mongodb'
import crypto from 'crypto'
import logger from '../../utils/logger.js'
import { getUser, getSession, removeSession } from '../sessions.js'
import database from '../../models/mongodb.js'
import { REACT_APP_ORIGIN, NODE_ENV } from '../../config.js'
import { setCache } from '../../models/redis.js'
import sendOTP from '../otp.js'
import { getCache } from '../../models/redis.js'

const adminRoute = [
    '/metrics/v1/prometheus',
    '/api/v1/sec/management',
    '/auth/token',
    '/auth/token/new',
    '/auth/token/delete',
    '/mail/send',
]
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

/* Redis naming prefix
 * internal - for internal session
 * external - for api access tokens
 * otp - for otp value
 */

const loopback = [
    '127.0.0.1', // IPv4
    '::1', // IPv6
    '::ffff:127.0.0.1', // IPv4-mapped IPv6
]

const internal = async (req, res, next) => {
    // validate us and headers
    const userAgent = req.headers['user-agent'] || ''
    const accept = req.headers['accept'] || ''
    const secFetch = req.headers['sec-fetch-mode'] || ''

    if (
        knownClients.some((bot) => userAgent.includes(bot)) ||
        !accept.includes('application/json') ||
        !secFetch ||
        (NODE_ENV === 'production' && REACT_APP_ORIGIN !== req.socket.remoteAddress) ||
        (NODE_ENV !== 'production' && !loopback.includes(req.socket.remoteAddress))
    )
        return res.status(401).json({ error: 'Unauthorized' })

    // start the first step in auth
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]

    const session = await getSession(req, token)
    if (!session) return res.status(401).json({ error: 'Unauthorized' })

    const theUser = await getUser(session)
    if (
        !theUser ||
        (adminRoute.includes(req.path) && !['super_admin', 'admin'].includes(theUser.role))
    )
        return res.status(401).json({ error: 'Unauthorized' })

    // const encryptedData = req.body.data
    // const decryptedData = crypto.privateDecrypt({
    //     key: session.key.privateKey, padding: crypto.constants.RSA_PKCS1_PADDING
    // }, Buffer.from(encryptedData, 'base64'))

    // req.body.data = JSON.parse(decryptedData.toString())

    req.request_type = 'internal'
    req.token = token
    req.user = theUser
    req.session = session

    if (session.active !== true || !theUser.email_verify_at) {
        if (req.path === '/otp' || req.path === '/otp/new') return next()
        const theOtp = await getCache(`otp-${req.user._id.toString()}`)
        if (!theOtp) sendOTP(req)
        return res
            .status(200)
            .json({ otp: true, email: req.user.email, message: 'OTP sent to your email' })
    }

    return next()
}

export default internal
