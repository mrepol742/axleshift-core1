import crypto from 'crypto'
import { addSession } from '../sessions.js'
import { getClientIp } from '../ip.js'

const Token = (theUser, req) => {
    const session_token = crypto.randomBytes(16).toString('hex')
    const clientIp = getClientIp(req)
    const userAgent = req.headers['user-agent'] || 'unknown'
    addSession(theUser, session_token, clientIp, userAgent)
    return session_token
}

export default Token
