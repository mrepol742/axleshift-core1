import dotenv from 'dotenv'
dotenv.config()
import { ObjectId } from 'mongodb'
import express from 'express'
import database from '../../models/db.js'
import logger from '../../components/logger.js'
import { addSession, removeSession } from '../../components/sessions.js'
import auth from '../../middleware/auth.js'
import recaptcha from '../../middleware/recaptcha.js'
import passwordHash, { generateUniqueId } from '../../components/password.js'
import { send } from '../../components/mail.js'
import sendOTPEmail from '../../components/otp/email.js'
import { Github, Google, FormLogin, FormRegister, FormOauth2 } from '../../components/auth/index.js'

const router = express.Router()

/*
  Url: POST /api/v1/auth/register
  Request Body:
     Email
     First name
     Last name
     Password
     Repeat password
     Recaptcha ref
*/
// TODO: recaptcha in this route is not working properly
// router.post("/register", recaptcha, async (req, res) => {
/*
       [0] [11:58:31.335] INFO (49191):
[0]     success: false
[0]     error-codes: [
[0]       "invalid-input-response"
[0]     ]
    */
router.post('/register', async (req, res) => {
    try {
        const {
            email,
            first_name,
            last_name,
            password,
            repeat_password,
            newsletter,
            type,
            credential,
            code,
        } = req.body
        if (!type || !['form', 'google', 'github'].includes(type)) return res.status(400).send()
        if (
            type === 'form' &&
            (!email || !first_name || !last_name || !password || !repeat_password || !newsletter)
        )
            return res.status(400).send()
        if (type === 'google' && !credential) return res.status(400).send()
        if (type === 'github' && !code) return res.status(400).send()

        // hehe i need to save a bit of line of code here
        // its getting quite bit complex
        if (type === 'google') return await Google(req, res)
        if (type === 'github') return await Github(req, res)

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(200).json({ error: 'Invalid email address' })
        if (password.length < 8)
            return res.status(200).json({ error: 'Password must be greater than 8 digit' })
        if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password))
            return res.status(200).json({
                error: 'Password must be at least 8 characters long and contain letters, numbers, and symbols.',
            })
        if (password != repeat_password)
            return res.status(200).json({ error: 'Password does not match' })

        return await FormRegister(req, res)
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
})

/*
  Url: POST /api/v1/auth/login
  Request Body:
     Email
     Password
     Recaptcha ref
  Returns:
     Session token
*/
router.post('/login', recaptcha, async (req, res) => {
    try {
        const { email, password, credential, type, code } = req.body
        if (!type || !['form', 'google', 'github'].includes(type)) return res.status(400).send()
        if (type === 'form' && (!email || !password)) return res.status(400).send()
        if (type === 'google' && !credential) return res.status(400).send()
        if (type === 'github' && !code) return res.status(400).send()

        if (type === 'google') return await Google(req, res)
        if (type === 'github') return await Github(req, res)

        // finally the end :(
        return await FormLogin(req, res)
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
})

/*
  Url: POST /api/v1/auth/verify
  Header:
     Authentication
  Returns:
     User info
     Otp
*/
router.post('/verify', auth, async function (req, res, next) {
    const { _id, email_verify_at, ...filter } = req.user
    filter.is_email_verified = email_verify_at !== ''
    if (req.user.email_verify_at !== '') return res.status(200).json(filter)

    const db = await database()
    const otpCollection = db.collection('otp')
    const theOtp = await otpCollection.findOne({ token: req.token, verified: false })
    if (theOtp) {
        const past = new Date(theOtp.created_at)
        const ten = 10 * 60 * 1000

        if (!(Date.now() - past > ten)) return res.status(200).json({ otp: true })
    }
    sendOTPEmail(req, otpCollection)

    return res.status(200).json({ otp: true })
})

/*
  Url: POST /api/v1/auth/user
  Header:
     Authentication
  Returns:
     User info
*/
router.post('/user', auth, async function (req, res, next) {
    try {
        return res.status(200).json({
            user: {
                email: req.user.email,
                first_name: req.user.first_name,
                last_name: req.user.last_name,
            },
        })
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
})

/*
  Url: POST /api/v1/auth/logout
  Header:
     Authentication
*/
router.post('/logout', auth, function (req, res, next) {
    removeSession(req.token)

    return res.status(200).send()
})

/*
  Url: POST /api/v1/auth/verify/otp/new
  Header:
     Authentication
  Request Body:
     Recaptcha ref
*/
router.post('/verify/otp/new', [auth, recaptcha], async function (req, res, next) {
    try {
        const db = await database()
        const otpCollection = db.collection('otp')
        const theOtp = await otpCollection.findOne({
            token: req.token,
            verified: false,
            expired: false,
        })
        if (!theOtp) return res.status(401).send()

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

            sendOTPEmail(req, otpCollection)
        }
        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
})

/*
  Url: POST /api/v1/auth/verify/otp
  Header:
     Authentication
  Request Body:
     Otp
     Recaptcha ref
*/
router.post('/verify/otp', [auth, recaptcha], async function (req, res, next) {
    try {
        const otp = req.body.otp
        if (!otp) return res.status(400).send()

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
            return res.status(200).json({ error: 'Invalid OTP' })

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
    return res.status(500).send()
})

/*
  Url: POST /api/v1/auth/token
  Header:
     Authentication
  Returns:
     API token
*/
router.get('/token', auth, async function (req, res, next) {
    try {
        const db = await database()
        const apiToken = await db.collection('apiToken').findOne({ user_id: req.user._id })
        return res.status(200).json({ token: apiToken.token })
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
})

/*
  Url: POST /api/v1/auth/token/whitelist-ip
  Header:
     Authentication
  Request Body:
     Otp
     Recaptcha ref
*/
router.get('/token/whitelist-ip', [auth, recaptcha], async function (req, res, next) {
    try {
        const db = await database()
        const apiToken = await db.collection('apiToken').findOne({ user_id: req.user._id })
        return res.status(200).json({ token: apiToken.token })
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
})

/*
  Url: POST /api/v1/auth/token/new
  Header:
     Authentication
  Request Body:
     Recaptcha ref
  Returns:
     API token
*/
router.post('/token/new', [auth, recaptcha], async function (req, res, next) {
    try {
        const db = await database()
        const apiTokenCollection = db.collection('apiToken')
        const apiToken = await apiTokenCollection.findOne({ user_id: req.user._id })
        const apiT = `core1_${passwordHash((Date.now() * 2) / 7)}`

        if (apiToken) {
            await apiTokenCollection.updateOne(
                { _id: new ObjectId(apiToken._id) },
                {
                    $set: {
                        active: true,
                        token: apiT,
                        compromised: false,
                        updated_at: Date.now(),
                        modified_by: 'system',
                    },
                },
            )
            return res.status(200).json({ token: apiT })
        }
        await apiTokenCollection.insertOne({
            user_id: req.user._id,
            active: true,
            compromised: false,
            token: apiT,
            whitelist_ip: [],
            created_at: Date.now(),
            updated_at: Date.now(),
        })

        return res.status(200).json({ token: apiT })
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
})

// means 9:51 pm
export default router
