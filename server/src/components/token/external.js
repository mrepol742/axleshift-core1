import { ObjectId } from 'mongodb'
import logger from '../../utils/logger.js'
import database from '../../models/mongodb.js'
import { getClientIp } from '../ip.js'
import { API_EXTERNAL_RATE_DELAY } from '../../config.js'

const allowedRoutes = ['/', '/:id']

const external = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]

    const requestPath = req.path
    const isAllowed = allowedRoutes.some((route) => {
        if (route === requestPath) return true
        const regex = new RegExp(`^${route.replace(/:\w+/, '\\w+')}$`)
        return regex.test(requestPath)
    })

    if (!isAllowed)
        return res
            .status(401)
            .json({ error: 'Unauthorized', message: `access denied to route: ${requestPath}` })

    const db = await database()
    const apiTokenCollection = db.collection('apiToken')
    const existingApiToken = await apiTokenCollection.findOne({
        token: token,
        active: true,
        compromised: false,
    })

    if (!existingApiToken)
        return res
            .status(401)
            .json({ error: 'Unauthorized', message: 'invalid or denied api token' })

    const ip = getClientIp(req)
    const w_ip = existingApiToken.whitelist_ip
    if (!w_ip.includes(ip))
        return res
            .status(401)
            .json({
                error: 'Unauthorized',
                message: 'Request denied your current ip address is not on whitelist',
                ip,
            })

    let user_a = req.headers['user-agent'] || 'unknown'
    Promise.all([
        (async () => {
            try {
                const db = await database()
                db.collection('apiToken').updateOne(
                    { token: token },
                    {
                        $set: {
                            user_agent: user_a,
                            last_accessed: Date.now(),
                        },
                    },
                )
            } catch (e) {
                logger.error(e)
            }
        })(),
    ])

    req.token = token

    setTimeout(() => {
        return next()
    }, API_EXTERNAL_RATE_DELAY)
}

export default external
