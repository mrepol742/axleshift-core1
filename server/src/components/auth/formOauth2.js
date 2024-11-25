import crypto from 'crypto'
import database from '../../models/mongodb.js'
import passwordHash, { generateUniqueId } from '../password.js'
import logger from '../logger.js'
import { addSession } from '../sessions.js'
import Token from './token.js'
import { send } from '../mail.js'
import Download from '../download.js'
import activity from '../activity.js'

const FormOauth2 = async (req, res) => {
    try {
        const credential = req.body.credential
        const provider = credential.request_type ? 'github' : 'google'

        const db = await database()
        const usersCollection = db.collection('users')
        if (/^\/login$/.test(req.url)) {
            const theUser = await usersCollection.findOne({
                [`oauth2.${provider}.email`]: credential.email,
            })
            if (theUser) {
                if (
                    !theUser.oauth2 ||
                    !theUser.oauth2[provider] ||
                    theUser.oauth2[provider].email !== credential.email
                )
                    return res
                        .status(200)
                        .json({ error: 'Please Login using your account password' })

                req.user = theUser
                req.session = { _id: 0 }
                activity(req, 'login')
                const session_token = await Token(theUser, req)
                return res.status(200).json({ token: session_token })
            }
        }

        const existingUser = await usersCollection.findOne({ email: credential.email })
        if (existingUser)
            return res.status(200).json({ error: 'This Email address is already registered' })

        const ref = generateUniqueId()

        await Promise.all([
            usersCollection.insertOne({
                email: credential.email,
                first_name: credential.given_name,
                last_name: credential.family_name,
                role: 'user',
                registration_type: provider,
                oauth2: {
                    [provider]: {
                        email: credential.email,
                        created_at: Date.now(),
                        updated_at: Date.now(),
                    },
                },
                password: null,
                email_verify_at: Date.now(),
                ref: ref,
                created_at: Date.now(),
                updated_at: Date.now(),
            }),
            send(
                {
                    to: credential.email,
                    subject: 'Welcome to Core 1 at Axleshift',
                    text: `<h2>We're excited to have you on board.</h2><p>Our platform is designed to streamline your management and enhance your shipping experience. With tools to manage shipments, track deliveries, and optimize routes, you'll have everything you need at your fingertips.</p><p>If you have any questions or need assistance getting started, don't hesitate to reach out. We're here to help!</p><p>Looking forward to a successful journey together!</p><br/>Best regards,<br/>Melvin Jones Repol<br/>The Developer<br/>Core 1 Axleshift`,
                },
                credential.given_name,
            ),
            Download(credential.picture, ref),
        ])

        const theUser = await usersCollection.findOne({ email: credential.email })
        const session_token = await Token(theUser, req)

        req.user = theUser
        req.session = { _id: 0 }
        activity(req, 'created account')
        activity(req, `bind ${provider} as authentication credentials`)
        return res.status(200).json({ token: session_token })
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
}

export default FormOauth2
