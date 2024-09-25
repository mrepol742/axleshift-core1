import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import fs from 'fs'
import cron from 'node-cron'
import connectToDatabase from '../models/db.js'
import logger from '../logger.js'
import sessions, { addSession, addUserProfileToSession, removeSession } from '../src/sessions.js'
import auth from '../middleware/auth.js'

const router = express.Router()

/*
router.post('/register', async (req, res) => {
    try {
        const email = req.body.email
        const db = await connectToDatabase()
        const collection = db.collection('users')
        const existingEmail = await collection.findOne({ email: req.body.email })

        if (existingEmail) {
            logger.error('Email id already exists')
            return res.status(400).json({ error: 'Email id already exists' })
        }
        const hash = await bcryptjs.hash(element.password, process.env.BCRYPT_SECRET);
        await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            emailVerifiedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        res.json({ register: true })
    } catch (e) {
        logger.error(e)
        return res.status(500).send('Internal server error')
    }
})
*/

/*
  Url: /api/auth/login
  Params:
     email
     password
     recaptchaRef
*/
router.post('/login', async (req, res) => {
    try {
        const { email, password, recaptchaRef } = req.body
        if (!email && !password && !recaptchaRef) return res.json({ status: 401 })

        const db = await connectToDatabase()
        const collection = db.collection('users')
        const theUser = await collection.findOne({ email: email })

        if (!theUser) res.json({ status: 404 })

        const hash = await bcryptjs.hash(password, process.env.BCRYPT_SECRET)

        if (hash != theUser.password) res.json({ status: 401 })
        addUserProfileToSession(theUser)

        const session_token = crypto
            .createHash('sha256')
            .update(theUser._id + Date.now())
            .digest('hex')
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        addSession(theUser, session_token, ip, req.headers['user-agent'])

        res.json({ status: 200, token: session_token })
        // finally the end :(
    } catch (e) {
        logger.error(e)
        res.json({ status: 500 })
    }
})

/*
  Url: /api/auth/verify
  Params:
     token
*/
router.post('/verify', auth, function (req, res, next) {
    res.json({ status: 200 })
})

/*
  Url: /api/auth/logout
  Params:
     token
*/
router.post('/logout', auth, function (req, res, next) {
    const token = req.body.token
    removeSession(token)

    res.json({ status: 200 })
})

export default router
