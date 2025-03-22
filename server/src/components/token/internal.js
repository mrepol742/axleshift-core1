import { ObjectId } from 'mongodb'
import crypto from 'crypto'
import logger from '../../utils/logger.js'
import { getUser, getSession } from '../sessions.js'
import database from '../../models/mongodb.js'
import { REACT_APP_ORIGIN } from '../../config.js'
import { setCache } from '../../models/redis.js'
import sendOTP from '../otp.js'

const adminRoute = ['/metrics/v1/prometheus', '/api/v1/sec/management']

const internal = async (req, res, next) => {
    if (REACT_APP_ORIGIN !== req.socket.remoteAddress)
        return res.status(401).json({ error: 'Unauthorized' })

    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]

    const [theUser, session] = await Promise.all([getUser(token), getSession(token)])

    if (!theUser || (adminRoute.includes(req.path) && theUser.role !== 'admin'))
        return res.status(401).json({ error: 'Unauthorized' })

    if (!session || !session.active) return res.status(401).json({ error: 'Unauthorized' })
    // const encryptedData = req.body.data
    // const decryptedData = crypto.privateDecrypt({
    //     key: session.key.privateKey, padding: crypto.constants.RSA_PKCS1_PADDING
    // }, Buffer.from(encryptedData, 'base64'))

    // req.body.data = JSON.parse(decryptedData.toString())

    req.request_type = 'internal'
    req.token = token
    req.user = theUser
    req.session = session

    if (!theUser.email_verify_at) {
        const db = await database()
        const otpCollection = db.collection('otp')
        const theOtp = await otpCollection.findOne({ token: req.token, verified: false })
        if (theOtp) {
            const past = new Date(theOtp.created_at)
            const ten = 10 * 60 * 1000

            if (!(Date.now() - past > ten))
                return res
                    .status(200)
                    .json({ otp: true, email: req.user.email, message: 'OTP already sent' })
        }
        sendOTP(req, otpCollection)
        return res.status(200).json({ otp: true, email: req.user.email })
    }

    return next()
}

export default internal
