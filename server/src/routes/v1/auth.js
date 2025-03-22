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

const router = express.Router()

/**
 * Account registration
 */
router.post('/register', [ipwhitelist, recaptcha], async (req, res) => {
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
        if (!type || !['form', 'google', 'github'].includes(type))
            return res.status(400).json({ error: 'Invalid request' })
        if (
            type === 'form' &&
            (!email || !first_name || !last_name || !password || !repeat_password || !newsletter)
        )
            return res.status(400).json({ error: 'Invalid request' })
        if (type === 'google' && !credential)
            return res.status(400).json({ error: 'Invalid request' })
        if (type === 'github' && !code) return res.status(400).json({ error: 'Invalid request' })

        // hehe i need to save a bit of line of code here
        // its getting quite bit complex
        if (type === 'google') return await Google(req, res)
        if (type === 'github') return await Github(req, res)

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
        const { email, password, credential, type, code } = req.body
        if (!type || !['form', 'google', 'github'].includes(type))
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
        const { first_name, last_name, timezone, email } = req.body
        const set = {}
        if (first_name && req.user.first_name !== first_name) set.first_name = first_name
        if (last_name && req.user.last_name !== last_name) set.last_name = last_name
        if (timezone && req.user.timezone !== timezone) set.timezone = timezone
        if (email && req.user.email !== email) set.email = email
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(200).json({ error: 'Invalid email address' })

        if (Object.keys(set).length === 0)
            return res.status(200).json({ error: 'No changes detected' })
        set.updated_at = Date.now()

        const db = await database()
        const usersCollection = db.collection('users')
        if (email) {
            const existingUser = await usersCollection.findOne({
                $or: [
                    { [`oauth2.google.email`]: email },
                    { [`oauth2.github.email`]: email },
                    { email: email },
                ],
            })
            if (existingUser)
                return res.status(200).json({ error: 'The email address is already used' })
        }

        await usersCollection.updateOne(
            { _id: new ObjectId(req.user._id) },
            {
                $set: set,
            },
        )
        activity(req, 'update user account information')
        const theUser = await usersCollection.findOne({ _id: new ObjectId(req.session.user_id) })
        return res.status(200).json({
            _id: theUser._id,
            email: theUser.email,
            first_name: theUser.first_name,
            last_name: theUser.last_name,
            role: theUser.role,
            email_verify_at: theUser.email_verify_at,
            oauth2: theUser.oauth2,
            password: theUser.password ? 'OK' : null,
            timezone: theUser.timezone,
            ref: theUser.ref,
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
        const theUser = await usersCollection.findOne({ _id: new ObjectId(req.user._id) })
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
        await usersCollection.updateOne(
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
        )
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
