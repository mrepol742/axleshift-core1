import { ObjectId } from 'mongodb'
import crypto from 'crypto'
import logger from '../../utils/logger.js'
import { getUser, getSession } from '../sessions.js'
import database from '../../models/mongodb.js'
import { REACT_APP_ORIGIN, API_RATE_DELAY } from '../../config.js'

const adminRoute = ['/metrics/v1/prometheus', '/api/v1/sec/management']
const exludeRoute = ['/api/v1/auth/verify']

const internal = async (req, res, next) => {
    if (REACT_APP_ORIGIN !== req.socket.remoteAddress)
        return res.status(401).json({ error: 'Unauthorized' })

    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]

    const [theUser, session] = await Promise.all([getUser(token), getSession(token)])

    if (!theUser || (adminRoute.includes(req.path) && theUser.role !== 'admin'))
        return res.status(401).json({ error: 'Unauthorized' })

    if (!session.active) return res.status(401).json({ error: 'Unauthorized' })
    // const encryptedData = req.body.data
    // const decryptedData = crypto.privateDecrypt({
    //     key: session.key.privateKey, padding: crypto.constants.RSA_PKCS1_PADDING
    // }, Buffer.from(encryptedData, 'base64'))

    // req.body.data = JSON.parse(decryptedData.toString())

    let user_a = req.headers['user-agent'] || 'unknown'

    const diff = Date.now() - session.last_accessed
    const week = 7 * 24 * 60 * 60 * 1000

    if (diff >= week) user_a = null

    Promise.all([
        (async () => {
            try {
                const db = await database()
                const value = session.user_agent === user_a
                db.collection('sessions').updateOne(
                    { token: token },
                    {
                        $set: {
                            active: value,
                            compromised: !value,
                            last_accessed: Date.now(),
                            modified_by: 'system',
                        },
                    },
                )
            } catch (e) {
                logger.error(e)
            }
        })(),
    ])

    if (session.user_agent !== user_a) return res.status(401).json({ error: 'Unauthorized' })

    req.token = token
    req.user = theUser
    req.session = session

    if (theUser.role === 'admin') return next()
    if (exludeRoute.includes(req.path)) return next()

    setTimeout(() => {
        return next()
    }, API_RATE_DELAY)
}

export default internal
