import { ObjectId } from 'mongodb'
import express from 'express'
import crypto from 'crypto'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import auth from '../../../middleware/auth.js'
import GeoLocationFilter from '../../../middleware/geo.js'
import ipwhitelist from '../../../middleware/ipwhitelist.js'
import recaptcha from '../../../middleware/recaptcha.js'
import activity from '../../../components/activity.js'
import sendOTP from '../../../components/otp.js'
import redis, { getCache, setCache, remCache, decrypt } from '../../../models/redis.js'
import { APP_KEY, REACT_APP_URL } from '../../../config.js'
import { send } from '../../../components/mail.js'

const router = express.Router()
const ten = 10 * 60 * 1000

router.post('/', [GeoLocationFilter, ipwhitelist, recaptcha], async function (req, res, next) {
    try {
        const email = req.body.email
        if (!email) return res.status(400).json({ error: 'Invalid request' })

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(200).json({ error: 'Invalid email address' })

        const db = await database()
        const usersCollection = db.collection('users')
        const existingUser = await usersCollection.findOne({
            $or: [
                { [`oauth2.google.email`]: email },
                { [`oauth2.github.email`]: email },
                { [`oauth2.microsoft.email`]: email },
                { email: email },
            ],
        })

        if (!existingUser) return res.status(200).json({ error: 'Email address not registered' })

        const token = crypto.randomBytes(32).toString('hex')
        const data = {
            _id: new ObjectId(),
            user_id: existingUser._id,
            last_accessed: Date.now(),
        }

        Promise.all([
            setCache(`forgot-password-${token}`, data, ten),
            send(
                {
                    to: email,
                    subject: 'You Requested a Password Reset',
                    text: `<h2>Your One Time Password Link:</h2><h2>${REACT_APP_URL}/auth/password-reset/${token}</h2><p>This Link is valid only for 10 mins, if you did not intend to reset your axleshift account, please ignore this email.</p><p>OTL is an extra layer of security used when requesting password reset into websites or apps. <b>DO NOT SHARE YOUR ONE TIME PASSWORD LINK</b>.</p>`,
                },
                existingUser.first_name,
            ),
        ])

        return res.status(200).json({ message: `Please check your email inbox or spam folder.` })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

router.post('/verify', [ipwhitelist, recaptcha], async function (req, res, next) {
    try {
        const token = req.body.token
        if (!token) return res.status(400).json({ error: 'Invalid request' })

        const data = await getCache(`forgot-password-${token}`)
        if (!data) return res.status(200).json({ error: 'Invalid or expired one time link' })

        res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

router.post('/reset', [GeoLocationFilter, ipwhitelist, recaptcha], async function (req, res, next) {
    try {
        const { password, repeat_password, token } = req.body
        if (!token || !password || !repeat_password)
            return res.status(400).json({ error: 'Invalid request' })

        const data = await getCache(`forgot-password-${token}`)
        if (!data) return res.status(200).json({ error: 'Invalid or expired one time link' })

        const db = await database()
        const usersCollection = db.collection('users')
        const existingUser = await usersCollection.findOne({
            _id: new ObjectId(data.user_id),
        })

        if (!existingUser) return res.status(200).json({ error: 'Email address not registered' })

        const passwordHash = crypto.createHmac('sha256', password).update(APP_KEY).digest('hex')

        await usersCollection.updateOne(
            { _id: new ObjectId(data.user_id) },
            { $set: { password: passwordHash } },
        )

        await remCache(`forgot-password-${token}`)

        res.status(200).send({ message: 'Password reset successfully' })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
