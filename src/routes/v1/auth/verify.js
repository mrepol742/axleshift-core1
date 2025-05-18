import { ObjectId } from 'mongodb'
import express from 'express'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import auth from '../../../middleware/auth.js'
import recaptcha from '../../../middleware/recaptcha.js'
import activity from '../../../components/activity.js'
import sendOTP from '../../../components/otp.js'
import redis, { getCache, setCache, remCache, decrypt } from '../../../models/redis.js'

const router = express.Router()
const ten = 10 * 60 * 1000
const five = 5 * 60 * 1000

router.post('/', auth, async function (req, res, next) {
    res.status(200).json(req.user)
})

router.post('/otp', [recaptcha, auth], async function (req, res, next) {
    try {
        const otp = req.body.otp.toString()
        if (!otp) return res.status(400).json({ error: 'Invalid request' })

        const redisClient = await redis()
        const stream = redisClient.scanStream()
        let theOtp = null

        for await (const keys of stream) {
            if (keys.length > 0) {
                const filteredKeys = keys.map((key) => key.replace('axleshift-core1:', ''))
                const values = await redisClient.mget(filteredKeys)
                keys.forEach(async (key, index) => {
                    const value = JSON.parse(await decrypt(values[index]))
                    if (
                        value &&
                        /^axleshift-core1:otp-[a-f0-9]{24}$/.test(key) &&
                        value.user_id === req.user._id.toString()
                    ) {
                        theOtp = value
                    }
                })
            }
        }

        if (theOtp.code !== parseInt(otp.replace(/[^0-9]/g, '')))
            return res.status(200).json({ error: 'Invalid One Time Password!' })

        const past = new Date(theOtp.created_at)
        if (Date.now() - past > ten) return res.status(200).json({ error: 'Expired OTP' })

        await Promise.all([
            remCache(`otp-${theOtp.user_id}`),
            (async () => {
                try {
                    if (req.user.email_verify_at) return
                    const db = await database()
                    const date = Date.now()

                    await db.collection('users').updateOne(
                        { _id: new ObjectId(req.user._id) },
                        {
                            $set: {
                                email_verify_at: date,
                                updated_at: date,
                            },
                        },
                    )
                    req.user.email_verify_at = date
                    await setCache(
                        `user-id-${req.user._id.toString()}`,
                        req.user,
                        24 * 60 * 60 * 1000,
                    )
                } catch (e) {
                    logger.error(e)
                }
            })(),
            (async () => {
                try {
                    req.session.active = true
                    await setCache(`internal-${req.session.token}`, req.session)
                } catch (e) {
                    logger.error(e)
                }
            })(),
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
        const theOtp = await getCache(`otp-${req.user._id}`)
        if (!theOtp) return res.status(401).json({ error: 'Unauthorized' })
        const past = new Date(theOtp.created_at)

        if (Date.now() - past > five) {
            sendOTP(req)
            activity(req, 'generate new mail otp')
            return res
                .status(200)
                .json({ message: `Please check your email inbox or spam folder.` })
        }

        return res.status(200).json({ message: `Please wait 5 minutes before requesting new one.` })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
