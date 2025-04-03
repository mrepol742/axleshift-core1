import { ObjectId } from 'mongodb'
import express from 'express'
import { Xendit } from 'xendit-node'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import auth from '../../middleware/auth.js'
import freight from '../../middleware/freight.js'
import invoices from '../../middleware/invoices.js'
import recaptcha from '../../middleware/recaptcha.js'
import { NODE_ENV } from '../../config.js'
import activity from '../../components/activity.js'
import address from '../../middleware/address.js'
import { send } from '../../components/mail.js'

const router = express.Router()

/**
 * Send an Email
 */
router.post('/send', [recaptcha, auth], async (req, res) => {
    try {
        const { email, subject, message } = req.body
        if (!email || !subject || !message)
            return res.status(400).json({ error: 'Invalid request' })

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            if (!['all', 'user', 'admin', 'staff', 'super_admin'].includes(email))
                return res.status(400).json({ error: 'Invalid user role' })
            const db = await database()
            const usersCollection = db.collection('users')
            const users = await usersCollection
                .find({ role: email !== 'all' ? email : {} }, { projection: { email: 1, _id: 0 } })
                .toArray()
            const userEmails = users.map((user) => user.email)
            console.log('User Emails:', userEmails)

            for (const userEmail of userEmails) {
                new Promise((resolve) => setTimeout(resolve, Math.random() * (10000 - 5000) + 5000))
                send(
                    {
                        to: userEmail,
                        subject: subject.replaceAll('[Axleshift]', ''),
                        text: message,
                    },
                    userEmail,
                    true,
                )
            }

            return res.status(200).json({
                message: `Email is being scheduled to send to ${userEmails.length} email(s)`,
            })
        }
        send(
            {
                to: email,
                subject: subject.replaceAll('[Axleshift]', ''),
                text: message,
            },
            email,
            true,
        )
        return res.status(200).json({ message: `Email sent successfully to ${email}` })
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
