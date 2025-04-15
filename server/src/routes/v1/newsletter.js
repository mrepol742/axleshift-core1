import { ObjectId } from 'mongodb'
import express from 'express'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import recaptcha from '../../middleware/recaptcha.js'
import ipwhitelist from '../../middleware/ipwhitelist.js'
import newsletter from '../../components/newsletter.js'

const router = express.Router()

/**
 * Add a email to newsletter
 */
router.post('/', [ipwhitelist, recaptcha], async (req, res, next) => {
    try {
        const email = req.body.email
        if (!email) return res.status(400).json({ error: 'Invalid request' })

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(200).json({ message: 'Invalid email address' })

        const isAlreadySubcribe = await newsletter(email)
        if (isAlreadySubcribe)
            return res.status(200).json({ message: 'The email is already subcribe to our newsletter' })
        return res.status(200).json({ message: 'If you can see this message means it work' })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
