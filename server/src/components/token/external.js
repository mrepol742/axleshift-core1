import { ObjectId } from 'mongodb'
import logger from '../../utils/logger.js'
import database from '../../models/mongodb.js'
import { getClientIp } from '../ip.js'
import { getCache, setCache } from '../../models/redis.js'

const external = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]

    const existingApiToken = await getCache(`external-${token}`)
    if (!existingApiToken) {
        return res
            .status(401)
            .json({ error: 'Unauthorized', message: 'invalid or denied api token' })
    }

    const ip = getClientIp(req)
    const w_ip = existingApiToken.whitelist_ip
    if (!w_ip.includes(ip))
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Request denied your current ip address is not on whitelist',
            ip,
        })

    Promise.all([
        (async () => {
            try {
                const now = Date.now()
                if (
                    now - existingApiToken.last_accessed > 60 * 1000 ||
                    existingApiToken.user_agent === 'unknown'
                ) {
                    ;(existingApiToken.ip_address = getClientIp(req)),
                        (existingApiToken.user_agent = req.headers['user-agent'] || 'unknown')
                    existingApiToken.last_accessed = now
                    setCache(`external-${token}`, existingApiToken, 'none')
                }
            } catch (e) {
                logger.error(e)
            }
        })(),
    ])

    req.request_type = 'external'
    req.token = token

    return next()
}

export default external
