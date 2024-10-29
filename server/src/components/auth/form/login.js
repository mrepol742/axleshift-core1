import crypto from 'crypto'
import database from '../../../models/mongodb.js'
import logger from '../../logger.js'
import passwordHash, { generateUniqueId } from '../../password.js'
import { addSession } from '../../../components/sessions.js'

const FormLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const db = await database()
        const theUser = await db.collection('users').findOne({ email: email })
        if (!theUser) return res.status(404).send()
        if (passwordHash(password) != theUser.password) return res.status(401).send()

        const session_token = crypto.createHash('sha256').update(generateUniqueId()).digest('hex')
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        addSession(theUser, session_token, ip, req.headers['user-agent'])

        return res.status(200).json({
            token: session_token,
        })
    } catch (err) {
        logger.error(err)
    }
    return res.status(500).send()
}

export default FormLogin
