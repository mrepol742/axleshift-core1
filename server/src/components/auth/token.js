import crypto from 'crypto'
import { generateUniqueId } from '../password.js'
import { addSession } from '../sessions.js'

const Token = (theUser, req) => {
    const session_token = crypto.createHash('sha256').update(generateUniqueId()).digest('hex')
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    addSession(theUser, session_token, ip, req.headers['user-agent'])
    return session_token
}

export default Token
