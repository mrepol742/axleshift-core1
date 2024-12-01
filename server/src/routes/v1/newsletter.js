import { ObjectId } from 'mongodb'
import express from 'express'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import recaptcha from '../../middleware/recaptcha.js'
import ipwhitelist from '../../middleware/ipwhitelist.js'

const router = express.Router()

/**
 * Add a email to newsletter
 */
router.post('/', [ipwhitelist, recaptcha], async (req, res, next) => {
    try {
        const email = req.body.email
        if (!email) return res.status(400).send()

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(200).json({ message: 'Invalid email address' })

        const db = await database()
        const newsletterCollection = db.collection('newsletter')
        const existingSubscriber = await newsletterCollection.findOne({ email: email })
        if (existingSubscriber)
            return res
                .status(200)
                .json({ message: 'The email is already subcribe to our newsletter' })

        const dateNow = Date.now()
        await newsletterCollection.insertOne({
            email: email,
            is_subsribe: true,
            created_at: dateNow,
            updated_at: dateNow,
        })

        return res.status(200).json({ message: 'If you can see this message means it work' })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

export default router
