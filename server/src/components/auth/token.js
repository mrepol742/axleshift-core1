import crypto from 'crypto'
import { generateUniqueId } from '../password.js'
import { addSession } from '../sessions.js'
import { getClientIp } from '../ip.js'

const Token = (theUser, req) => {
    const uniqueId = generateUniqueId()
    const session_token = crypto.createHash('sha256').update(uniqueId).digest('hex')
    const clientIp = getClientIp(req)
    const userAgent = req.headers['user-agent'] || 'unknown'
    addSession(theUser, session_token, clientIp, userAgent)
    return session_token
}

export default Token
