import { ObjectId } from 'mongodb'
import crypto from 'crypto'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import { addSession } from '../../../components/sessions.js'
import { getClientIp } from '../../ip.js'
import { APP_KEY } from '../../../config.js'
import device from '../../../components/device.js'

const FormLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const db = await database()
        const theUser = await db.collection('users').findOne({
            $or: [
                { [`oauth2.google.email`]: email },
                { [`oauth2.github.email`]: email },
                { email: email },
            ],
        })
        if (!theUser) return res.status(404).send()

        const passwordHash = crypto.createHmac('sha256', password).update(APP_KEY).digest('hex')
        if (passwordHash !== theUser.password) return res.status(401).send()

        const session_token = crypto.randomBytes(16).toString('hex')
        const userAgent = req.headers['user-agent'] || 'unknown'
        const newDevice = crypto.createHmac('sha256', userAgent).update(APP_KEY).digest('hex')
        addSession(theUser, session_token, getClientIp(req), userAgent)

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
        })
    } catch (err) {
        logger.error(err)
    }
    return res.status(500).send()
}

export default FormLogin
