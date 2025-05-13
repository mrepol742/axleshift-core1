import crypto from 'crypto'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import { send } from '../../mail.js'
import activity, { sendNotification } from '../../activity.js'
import { APP_KEY, NODE_ENV } from '../../../config.js'
import addToNewsletter from '../../../components/newsletter.js'

/**
 * Handles the regiter form submission.
 *
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */
const FormRegister = async (req, res) => {
    try {
        const { username, email, first_name, last_name, password, newsletter } = req.body
        const db = await database()
        const usersCollection = db.collection('users')

        if (
            /^[a-zA-Z0-9._%+-]+@(?!.*(tempmail|mailinator|10minutemail|guerrillamail)).*$/.test(
                email,
            )
        )
            return res.status(200).json({
                error: 'Email address is not allowed',
            })

        const existingUser = await usersCollection.findOne({
            $or: [
                { [`oauth2.google.email`]: email },
                { [`oauth2.github.email`]: email },
                { [`oauth2.microsoft.email`]: email },
                { email: email },
                { username: username },
            ],
        })

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(200).json({
                    error: 'Username already taken',
                })
            }
            return res.status(200).json({
                error: 'Email address already registered',
            })
        }

        const passwordHash = crypto.createHmac('sha256', password).update(APP_KEY).digest('hex')
        const ref = crypto.randomBytes(4).toString('hex')
        const dateNow = Date.now()

        await Promise.all([
            addToNewsletter(email),
            usersCollection.insertOne({
                email: email,
                first_name: first_name,
                last_name: last_name,
                role: 'user',
                registration_type: 'form',
                avatar: null,
                password: passwordHash,
                email_verify_at: null,
                ref: ref,
                created_at: dateNow,
                updated_at: dateNow,
            }),
            send(
                {
                    to: email,
                    subject: 'Welcome Aboard',
                    text: `<h2>We're excited to have you on board.</h2><p>Our platform is designed to streamline your management and enhance your shipping experience. With tools to manage shipments, track deliveries, and optimize routes, you'll have everything you need at your fingertips.</p><p>If you have any questions or need assistance getting started, don't hesitate to reach out. We're here to help!</p><p>Looking forward to a successful journey together!</p><br/>Best regards,<br/>Melvin Jones Repol`,
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
                            const dateNow = Date.now()
                            newsletterCollection.insertOne({
                                email: email,
                                is_subsribe: true,
                                created_at: dateNow,
                                updated_at: dateNow,
                            })
                        }
                    }
                } catch (e) {
                    logger.error(e)
                }
            })(),
        ])

        activity(req, 'created account')
        const title = 'Account Created Successfully'
        const message = `Welcome ${first_name} ${last_name}, your account has been created successfully.`
        sendNotification(req, { title, message })
        return res.status(201).json({ type: 'form' })
    } catch (err) {
        logger.error(err)
    }
    return res.status(500).json({ error: 'Internal server error' })
}

export default FormRegister
