import { ObjectId } from 'mongodb'
import crypto from 'crypto'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import { addSession, isNewIP } from '../../../components/sessions.js'
import { getClientIp } from '../../ip.js'
import { APP_KEY, NODE_ENV } from '../../../config.js'

const FormLogin = async (req, res) => {
    try {
        const { email, password, location } = req.body
        const db = await database()
        const theUser = await db.collection('users').findOne({
            $or: [
                { [`oauth2.google.email`]: email },
                { [`oauth2.github.email`]: email },
                { email: email },
                { username: email },
            ],
        })

        if (!theUser)
            return res.status(404).json({
                error: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    ? "The email you entered isn't connected to an account."
                    : "The username you entered isn't connected to an account.",
            })

        const passwordHash = crypto.createHmac('sha256', password).update(APP_KEY).digest('hex')
        if (passwordHash !== theUser.password)
            return res.status(401).json({ error: "The password you've entered is incorrect." })

        if (NODE_ENV === 'production' && theUser.role === 'user')
            res.status(200).json({
                error: 'You have successfully registered. We will send an email to you once everything is ready.',
            })

        const session_token = crypto.randomBytes(16).toString('hex')
        const userAgent = req.headers['user-agent'] || 'unknown'
        const ip = getClientIp(req)

        addSession(theUser, session_token, ip, userAgent, location)
        isNewIP(ip, theUser)

        return res.status(200).json({
            token: session_token,
        })
    } catch (err) {
        logger.error(err)
    }
    return res.status(500).json({ error: 'Internal server error' })
}

export default FormLogin
