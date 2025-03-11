import { ObjectId } from 'mongodb'
import crypto from 'crypto'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import { addSession } from '../../../components/sessions.js'
import { getClientIp } from '../../ip.js'
import { APP_KEY, NODE_ENV } from '../../../config.js'
import device from '../../../components/device.js'

const FormLogin = async (req, res) => {
    try {
        const { email, password, location } = req.body
        if (!email || !password || !location)
            return res.status(400).json({ error: 'Invalid request' })
        const db = await database()
        const theUser = await db.collection('users').findOne({
            $or: [
                { [`oauth2.google.email`]: email },
                { [`oauth2.github.email`]: email },
                { email: email },
            ],
        })
        if (!theUser) return res.status(404).json({ error: 'User not found' })

        const passwordHash = crypto.createHmac('sha256', password).update(APP_KEY).digest('hex')
        if (passwordHash !== theUser.password)
            return res.status(401).json({ error: 'Invalid login credentials' })

        if (NODE_ENV === 'production' && theUser.role === 'user')
            res.status(200).json({
                error: 'You have no permission to continue. Please contact the admin to allow non user login.',
            })

        const session_token = crypto.randomBytes(16).toString('hex')
        const userAgent = req.headers['user-agent'] || 'unknown'
        const newDevice = crypto.createHmac('sha256', userAgent).update(APP_KEY).digest('hex')
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
        const key = {
            publicKey: btoa(publicKey.export({ type: 'pkcs1', format: 'pem' })),
            privateKey: btoa(privateKey.export({ type: 'pkcs1', format: 'pem' })),
        }
        addSession(theUser, session_token, getClientIp(req), userAgent, location, key)

        if (theUser.devices) {
            const isNewDevice = theUser.devices.some((device) => {
                return newDevice === device
            })

            if (!isNewDevice) return device(theUser, newDevice)
            // otp here
        }
        if (!theUser.devices) device(theUser, newDevice)

        return res.status(200).json({
            token: session_token,
            key,
        })
    } catch (err) {
        logger.error(err)
    }
    return res.status(500).json({ error: 'Internal server error' })
}

export default FormLogin
