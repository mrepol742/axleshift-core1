import crypto from 'crypto'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import Token from './token.js'
import { send } from '../mail.js'
import Download from '../../utils/download.js'
import activity from '../activity.js'
import { NODE_ENV } from '../../config.js'
import { upload, uploadToS3 } from '../../components/s3/profile.js'

const FormOauth2 = async (req, res) => {
    try {
        const credential = req.body.credential
        const provider = credential.request_type ? 'github' : 'google'

        const db = await database()
        const usersCollection = db.collection('users')
        const theUser = await usersCollection.findOne({
            $or: [
                { [`oauth2.google.email`]: credential.email },
                { [`oauth2.github.email`]: credential.email },
                { email: credential.email },
            ],
        })

        if (NODE_ENV === 'production' && theUser.role === 'user')
            res.status(200).json({
                error: 'You have successfully registered. We will send an email to you once everything is ready.',
            })

        // login
        if (theUser) {
            if (
                theUser.oauth2 &&
                theUser.oauth2[provider] &&
                theUser.oauth2[provider].email === credential.email
            ) {
                const token = await Token(theUser, req)
                return res.status(200).json(token)
            } else {
                await Promise.all([
                    usersCollection.updateOne(
                        { _id: theUser._id },
                        {
                            $set: {
                                [`oauth2.${provider}.email`]: credential.email,
                                [`oauth2.${provider}.created_at`]: Date.now(),
                                [`oauth2.${provider}.updated_at`]: Date.now(),
                                email_verify_at: null,
                            },
                        },
                    ),
                    send(
                        {
                            to: credential.email,
                            subject: `Successfully bind ${provider} | Axleshift`,
                            text: `You have successfully bind ${provider} as your authentication credentials. If you have any questions or need assistance, don't hesitate to reach out. We're here to help!`,
                        },
                        credential.given_name,
                    ),
                ])
                const token = await Token(theUser, req)
                return res.status(200).json(token)
            }
        }
        // register
        const ref = crypto.randomBytes(4).toString('hex')
        const dateNow = Date.now()

        await Promise.all([
            usersCollection.insertOne({
                username: crypto
                    .createHash('sha256')
                    .update(credential.email)
                    .digest('hex')
                    .slice(0, 8),
                email: credential.email,
                first_name: credential.given_name,
                last_name: credential.family_name,
                role: 'user',
                registration_type: provider,
                avatar: ref,
                oauth2: {
                    [provider]: {
                        email: credential.email,
                        created_at: dateNow,
                        updated_at: dateNow,
                    },
                },
                password: null,
                email_verify_at: null,
                ref: ref,
                created_at: dateNow,
                updated_at: dateNow,
            }),
            send(
                {
                    to: credential.email,
                    subject: 'Welcome Aboard',
                    text: `<h2>We're excited to have you on board.</h2><p>Our platform is designed to streamline your management and enhance your shipping experience. With tools to manage shipments, track deliveries, and optimize routes, you'll have everything you need at your fingertips.</p><p>If you have any questions or need assistance getting started, don't hesitate to reach out. We're here to help!</p><p>Looking forward to a successful journey together!</p><br/>Best regards,<br/>Melvin Jones Repol<br/>The Developer<br/>Core 1 Axleshift`,
                },
                credential.given_name,
            ),
            Download(credential.picture, ref),
        ])

        const _theUser = await usersCollection.findOne({ email: credential.email })
        _theUser.log = 'created account'
        _theUser.log1 = `bind ${provider} as authentication credentials`
        const token = await Token(_theUser, req)
        return res.status(200).json(token)
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).json({ error: 'Internal server error' })
}

export default FormOauth2
