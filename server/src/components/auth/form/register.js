import crypto from 'crypto'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import { addSession } from '../../../components/sessions.js'
import { send } from '../../mail.js'
import activity from '../../activity.js'
import { APP_KEY } from '../../../config.js'

const FormRegister = async (req, res) => {
    try {
        const { email, first_name, last_name, password, newsletter } = req.body
        const db = await database()
        const usersCollection = db.collection('users')
        const existingUser = await usersCollection.findOne({
            $or: [
                { [`oauth2.google.email`]: email },
                { [`oauth2.github.email`]: email },
                { email: email },
            ],
        })

        if (existingUser)
            return res.status(200).json({
                error: 'Email address already registered',
            })

        const passwordHash = crypto.createHmac('sha256', password).update(APP_KEY).digest('hex')
        const ref = crypto.randomBytes(4).toString('hex')

        await Promise.all([
            usersCollection.insertOne({
                email: email,
                first_name: first_name,
                last_name: last_name,
                role: 'user',
                registration_type: 'form',
                avatar: null,
                password: passwordHash,
                email_verify_at: '',
                ref: ref,
                created_at: Date.now(),
                updated_at: Date.now(),
            }),
            send(
                {
                    to: email,
                    subject: 'Welcome to Core 1 at Axleshift',
                    text: `<h2>We're excited to have you on board.</h2><p>Our platform is designed to streamline your management and enhance your shipping experience. With tools to manage shipments, track deliveries, and optimize routes, you'll have everything you need at your fingertips.</p><p>If you have any questions or need assistance getting started, don't hesitate to reach out. We're here to help!</p><p>Looking forward to a successful journey together!</p><br/>Best regards,<br/>Melvin Jones Repol<br/>The Developer<br/>Core 1 Axleshift`,
                },
                first_name,
            ),
            (async () => {
                try {
                    if (newsletter === 'true') {
                        const newsletterCollection = db.collection('newsletter')
                        const existingSubscriber = await newsletterCollection.findOne({
                            email: email,
                        })
                        if (!existingSubscriber) {
                            newsletterCollection.insertOne({
                                email: email,
                                is_subsribe: true,
                                created_at: Date.now(),
                                updated_at: Date.now(),
                            })
                        }
                    }
                } catch (e) {
                    logger.error(e)
                }
            })(),
        ])

        activity(req, 'created account')
        return res.status(201).json({ type: 'form' })
    } catch (err) {
        logger.error(err)
    }
    return res.status(500).send()
}

export default FormRegister
