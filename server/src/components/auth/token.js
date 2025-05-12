import crypto from 'crypto'
import { addSession, isNewIP } from '../sessions.js'
import { getClientIp } from '../ip.js'

/**
 * Generates a session token for the user and stores session information.
 * 
 * @param {Object} theUser 
 * @param {Object} req
 * @return {Object}
 */
const Token = (theUser, req) => {
    // const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
    const { location } = req.body
    const session_token = crypto.randomBytes(16).toString('hex')
    const clientIp = getClientIp(req)
    const userAgent = req.headers['user-agent'] || 'unknown'
    // const key = {
    //     publicKey: btoa(publicKey.export({ type: 'pkcs1', format: 'pem' })),
    //     privateKey: btoa(privateKey.export({ type: 'pkcs1', format: 'pem' })),
    // }
    addSession(theUser, session_token, clientIp, userAgent, location)
    isNewIP(clientIp, theUser)
    return {
        token: session_token,
    }
}

export default Token
