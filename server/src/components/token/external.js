import dotenv from 'dotenv'
dotenv.config()
import { ObjectId } from 'mongodb'
import logger from '../logger.js'
import database from '../../models/db.js'
import { getClientIp } from '../ip.js'

const allowedRoutes = ['/:id']

const external = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]

    const requestPath = req.path
    const isAllowed = allowedRoutes.some((route) => {
        if (route === requestPath) return true
        const regex = new RegExp(`^${route.replace(/:\w+/, '\\w+')}$`)
        return regex.test(requestPath)
    })

    if (!isAllowed) return res.status(401).send()

    const db = await database()
    const apiTokenCollection = db.collection('apiToken')
    const existingApiToken = await apiTokenCollection.findOne({
        token: token,
        active: true,
        compromised: false,
    })

    if (!existingApiToken) {
        logger.error(`invalid or denied api token: ${token}`)
        return res.status(403).send()
    }

    const ip = getClientIp(req)
    const w_ip = existingApiToken.whitelist_ip
    if (!w_ip.includes(ip)) return res.status(403).send()

    Promise.all([
        (async () => {
            try {
                const db = await database()
                db.collection('apiToken').updateOne(
                    { token: token },
                    {
                        $set: {
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
    }, process.env.API_EXTERNAL_RATE_DELAY)
}

export default external
