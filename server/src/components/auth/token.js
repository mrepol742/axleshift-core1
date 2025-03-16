import crypto from 'crypto'
import { addSession } from '../sessions.js'
import { getClientIp } from '../ip.js'

const Token = (theUser, req) => {
    // const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
    const session_token = crypto.randomBytes(16).toString('hex')
    const clientIp = getClientIp(req)
    const userAgent = req.headers['user-agent'] || 'unknown'
    // const key = {
    //     publicKey: btoa(publicKey.export({ type: 'pkcs1', format: 'pem' })),
    //     privateKey: btoa(privateKey.export({ type: 'pkcs1', format: 'pem' })),
    // }
    addSession(theUser, session_token, clientIp, userAgent, null)
    return {
        token: session_token,
    }
}

export default Token
