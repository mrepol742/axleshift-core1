import { ObjectId } from 'mongodb'
import express from 'express'
import crypto from 'crypto'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import { removeSession } from '../../components/sessions.js'
import auth from '../../middleware/auth.js'
import recaptcha from '../../middleware/recaptcha.js'
import ipwhitelist from '../../middleware/ipwhitelist.js'
import { Github, Google, FormLogin, FormRegister, FormOauth2 } from '../../components/auth/index.js'
import activity from '../../components/activity.js'
import { APP_KEY } from '../../config.js'
import { remCache } from '../../models/redis.js'

const router = express.Router()
const thirtyDays = 30 * 24 * 60 * 60 * 1000

/**
 * Account registration
 */
router.post('/register', [ipwhitelist, recaptcha], async (req, res) => {
    try {
        const {
            username,
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
        if (!type || !['form', 'google', 'github'].includes(type))
            return res.status(400).json({ error: 'Invalid request' })
        if (
            type === 'form' &&
            (!username ||
                !email ||
                !first_name ||
                !last_name ||
                !password ||
                !repeat_password ||
                !newsletter)
        )
            return res.status(400).json({ error: 'Invalid request' })
        if (type === 'google' && !credential)
            return res.status(400).json({ error: 'Invalid request' })
        if (type === 'github' && !code) return res.status(400).json({ error: 'Invalid request' })

        // hehe i need to save a bit of line of code here
        // its getting quite bit complex
        if (type === 'google') return await Google(req, res)
        if (type === 'github') return await Github(req, res)

        if (!/^[a-zA-Z0-9]+$/.test(username))
            return res.status(200).json({ error: 'Username must only contain letters and numbers' })
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(200).json({ error: 'Invalid email address' })
        if (password.length < 8)
            return res.status(200).json({ error: 'Password must be at least 8 characters long' })
        if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).+$/.test(password))
            return res.status(200).json({
                error: 'Password must contain letters, numbers, and symbols.',
            })
        if (password != repeat_password)
            return res.status(200).json({ error: 'Password does not match' })

        return await FormRegister(req, res)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Login portal
 */
router.post('/login', [ipwhitelist, recaptcha], async (req, res) => {
    try {
        const { email, password, credential, type, code, location } = req.body
        if (!type || !location || !['form', 'google', 'github'].includes(type))
            return res.status(400).json({ error: 'Invalid request' })
        if (type === 'form' && (!email || !password))
            return res.status(400).json({ error: 'Invalid request' })
        if (type === 'google' && !credential)
            return res.status(400).json({ error: 'Invalid request' })
        if (type === 'github' && !code) return res.status(400).json({ error: 'Invalid request' })

        if (type === 'google') return await Google(req, res)
        if (type === 'github') return await Github(req, res)

        // finally the end :(
        return await FormLogin(req, res)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Update user information
 */
router.post('/user', [recaptcha, auth], async (req, res, next) => {
    try {
        const { username, email, first_name, last_name, timezone } = req.body
        const set = {}

        if (first_name && req.user.first_name !== first_name) set.first_name = first_name
        if (last_name && req.user.last_name !== last_name) set.last_name = last_name
        if (timezone && req.user.timezone !== timezone) set.timezone = timezone

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(200).json({ error: 'Invalid email address' })
        if (email && req.user.email !== email) {
            set.email = email
            set.email_verify_at = null
            set.email_last_updated_at = Date.now()
        }

        if (username && !/^[a-zA-Z0-9]+$/.test(username))
            return res.status(200).json({ error: 'Username must only contain letters and numbers' })
        if (username && req.user.username !== username) {
            set.username = username
            set.username_last_updated_at = Date.now()
        }

        if (Object.keys(set).length === 0)
            return res.status(200).json({ error: 'No changes detected' })

        if (
            set.username &&
            req.user.username_last_updated_at &&
            Date.now() - req.user.username_last_updated_at < thirtyDays
        )
            return res
                .status(200)
                .json({ error: 'Username can only be changed once every 30 days' })

        if (
            set.email &&
            req.user.email_last_updated_at &&
            Date.now() - req.user.email_last_updated_at < thirtyDays
        )
            return res.status(200).json({ error: 'Email can only be changed once every 30 days' })

        const db = await database()
        const usersCollection = db.collection('users')
        const [usernameRes, emailRes] = await Promise.all([
            async () => {
                if (set.username) {
                    const existingUser = await usersCollection.findOne({
                        username: username,
                    })
                    if (existingUser) return true
                }
                return false
            },
            async () => {
                if (set.email) {
                    const existingUser = await usersCollection.findOne({
                        $or: [
                            { [`oauth2.google.email`]: email },
                            { [`oauth2.github.email`]: email },
                            { email: email },
                        ],
                    })
                    if (existingUser) return true
                }
                return false
            },
        ])

        if (usernameRes === true)
            return res.status(200).json({
                error: 'Username already taken',
            })

        if (emailRes === true)
            return res.status(200).json({
                error: 'Email address already registered',
            })

        set.updated_at = Date.now()

        await Promise.all([
            remCache(`user-id-${req.user._id}`),
            usersCollection.updateOne(
                { _id: new ObjectId(req.user._id) },
                {
                    $set: set,
                },
            ),
            activity(req, 'update user account information'),
        ])

        return res.status(200).json({
            _id: req.user._id,
            username: set.username ? set.username : req.user.username,
            username_last_updated_at: set.username_last_updated_at
                ? set.username_last_updated_at
                : req.user.username_last_updated_at,
            email: set.email ? set.email : req.user.email,
            email_last_updated_at: set.email_last_updated_at
                ? set.email_last_updated_at
                : req.user.email_last_updated_at,
            first_name: set.first_name ? set.first_name : req.user.first_name,
            last_name: set.last_name ? set.last_name : req.user.last_name,
            role: req.user.role,
            email_verify_at: set.email_verify_at ? set.email_verify_at : req.user.email_verify_at,
            oauth2: req.user.oauth2,
            password: req.user.password,
            timezone: set.timezone ? set.timezone : req.user.timezone,
            ref: req.user.ref,
        })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Set and change user password
 */
router.post('/password', [recaptcha, auth], async (req, res, next) => {
    try {
        const { password, new_password, repeat_password } = req.body
        if (!new_password || !repeat_password)
            return res.status(400).json({ error: 'Invalid request' })
        if (req.user.password === 'OK' && !password)
            return res.status(400).json({ error: 'Invalid request' })

        const db = await database()
        const usersCollection = db.collection('users')
        const theUser = await usersCollection.findOne(
            { _id: new ObjectId(req.user._id) },
            { projection: { password: 1 } },
        )
        // return 401 instead of 404 to remove the cookies
        if (!theUser) return res.status(401).json({ error: 'Unauthorized' })

        const passwordHash = crypto.createHmac('sha256', password).update(APP_KEY).digest('hex')
        if (req.user.password === 'OK') {
            if (passwordHash !== theUser.password)
                return res.status(200).json({ error: 'Invalid password' })
        }

        if (new_password.length < 8)
            return res.status(200).json({ error: 'Password must be at least 8 characters long' })
        if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).+$/.test(new_password))
            return res.status(200).json({
                error: 'Password must contain letters, numbers, and symbols.',
            })
        if (new_password != repeat_password)
            return res.status(200).json({ error: 'Password does not match' })

        const newPasswordHash = crypto
            .createHmac('sha256', new_password)
            .update(APP_KEY)
            .digest('hex')
        if (req.user.password === 'OK' && theUser.password === newPasswordHash)
            return res.status(200).json({ error: 'yup here we go again you cannot do that.' })

        if (theUser.old_passwords) {
            const isNewPasswordOld = theUser.old_passwords.some((oldPasswordHash) => {
                return passwordHash === oldPasswordHash
            })

            if (isNewPasswordOld)
                return res
                    .status(200)
                    .json({ error: 'The new password cannot be the same as your previous ones.' })
        }

        const dateNow = Date.now()
        await Promise.all([
            remCache(`user-id-${req.user._id}`),
            usersCollection.updateOne(
                { _id: new ObjectId(req.user._id) },
                {
                    $set: {
                        password: newPasswordHash,
                        password_changed_on: dateNow,
                        updated_at: dateNow,
                    },
                    $push: {
                        old_passwords: {
                            $each: [passwordHash],
                            $position: 0,
                            $slice: -5,
                        },
                    },
                },
            ),
        ])
        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Logout
 */
router.post('/logout', auth, (req, res, next) => {
    removeSession(req.token)
    activity(req, 'logout')
    res.status(200).send()
})

// means 9:51 pm
export default router
