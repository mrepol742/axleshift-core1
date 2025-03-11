import { ObjectId } from 'mongodb'
import express from 'express'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import auth from '../../../middleware/auth.js'
import recaptcha from '../../../middleware/recaptcha.js'
import activity from '../../../components/activity.js'
import sendOTP from '../../../components/otp.js'

const router = express.Router()

router.post('/', auth, async function (req, res, next) {
    const { _id, email_verify_at, ...filter } = req.user
    filter.is_email_verified = email_verify_at !== null
    if (filter.is_email_verified) return res.status(200).json(filter)

    const db = await database()
    const otpCollection = db.collection('otp')
    const theOtp = await otpCollection.findOne({ token: req.token, verified: false })
    if (theOtp) {
        const past = new Date(theOtp.created_at)
        const ten = 10 * 60 * 1000

        if (!(Date.now() - past > ten))
            return res.status(200).json({ otp: true, email: req.user.email })
    }
    sendOTP(req, otpCollection)

    return res.status(200).json({ otp: true, email: req.user.email })
})

router.post('/otp', [recaptcha, auth], async function (req, res, next) {
    try {
        const otp = req.body.otp.toString()
        if (!otp) return res.status(400).json({ error: 'Invalid request' })

        const db = await database()
        const otpCollection = db.collection('otp')
        const theOtp = await otpCollection.findOne({
            token: req.token,
            verified: false,
            expired: false,
        })
        if (theOtp) {
            const past = new Date(theOtp.created_at)
            const ten = 10 * 60 * 1000

            if (Date.now() - past > ten) return res.status(200).json({ error: 'Expired OTP' })
        }

        if (theOtp.code !== parseInt(otp.replace(/[^0-9]/g, '')))
            return res.status(200).json({ error: 'Invalid One Time Password!' })

        // mark the otp
        await Promise.all([
            otpCollection.updateOne(
                { _id: new ObjectId(theOtp._id) },
                {
                    $set: {
                        verified: true,
                        updated_at: Date.now(),
                        modified_by: 'system',
                    },
                },
            ),
            db.collection('users').updateOne(
                { _id: new ObjectId(req.user._id) },
                {
                    $set: {
                        email_verify_at: Date.now(),
                        updated_at: Date.now(),
                    },
                },
            ),
        ])
        // oh god its 21:51!
        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

router.post('/otp/new', [recaptcha, auth], async function (req, res, next) {
    try {
        const db = await database()
        const otpCollection = db.collection('otp')
        const theOtp = await otpCollection.findOne({
            token: req.token,
            verified: false,
            expired: false,
        })
        if (!theOtp) return res.status(401).json({ error: 'Unauthorized' })

        const past = new Date(theOtp.created_at)
        const ten = 10 * 60 * 1000

        if (Date.now() - past > ten) {
            await otpCollection.updateOne(
                { _id: new ObjectId(theOtp._id) },
                {
                    $set: {
                        verified: false,
                        expired: true,
                        updated_at: Date.now(),
                        modified_by: 'system',
                    },
                },
            )

            sendOTP(req, otpCollection)
            activity(req, 'generate new mail otp')
        }
        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
