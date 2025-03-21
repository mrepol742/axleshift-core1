import { ObjectId } from 'mongodb'
import logger from '../../utils/logger.js'
import database from '../../models/mongodb.js'
import { getClientIp } from '../ip.js'
import { getCache, setCache } from '../../models/redis.js'

const external = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]

    const db = await database()

    let existingApiToken = await getCache(`external-${token}`)
    if (
        !existingApiToken ||
        (existingApiToken && !existingApiToken.active && !existingApiToken.compromised)
    ) {
        existingApiToken = await db.collection('apiToken').findOne(
            {
                token: token,
                active: true,
                compromised: false,
            },
            { projection: { whitelist_ip: 1 } },
        )

        if (!existingApiToken)
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

    let user_a = req.headers['user-agent'] || 'unknown'
    Promise.all([
        (async () => {
            try {
                const date = Date.now()
                const db = await database()
                db.collection('apiToken').updateOne(
                    { token: token },
                    {
                        $set: {
                            user_agent: user_a,
                            last_accessed: date,
                        },
                    },
                )

                existingApiToken.user_agent = user_a
                existingApiToken.last_accessed = date
                setCache(`external-${token}`, existingApiToken)
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
