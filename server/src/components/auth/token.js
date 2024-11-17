import crypto from 'crypto'
import { generateUniqueId } from '../password.js'
import { addSession } from '../sessions.js'
import { getClientIp } from '../ip.js'

const Token = (theUser, req) => {
    const session_token = crypto.createHash('sha256').update(generateUniqueId()).digest('hex')``
    addSession(theUser, session_token, getClientIp(req), req.headers['user-agent'])
    return session_token
}

export default Token
