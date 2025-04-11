import { getCache } from '../models/redis.js'
import logger from '../utils/logger.js'

const IPAddressFilter = async (req, res, next) => {
    try {
        const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        if (!clientIP) return res.status(401).send()
        const ipListing = await getCache('ip-filtering')
        if (!ipListing) return next()
        const { filter_mode, ip } = ipListing
        const isIPInRange = (ip, range) => {
            const [start, end] = range.split('-').map((ip) => ip.trim())
            const ipToNum = (ip) =>
                ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0)
            const ipNum = ipToNum(ip)
            return ipNum >= ipToNum(start) && ipNum <= ipToNum(end)
        }

        const singleIPs = ip.filter((entry) => !entry.includes('-'))
        const rangeIPs = ip.filter((entry) => entry.includes('-'))
        const isInSingle = singleIPs.includes(clientIP)

        if (
            (filter_mode === 'whitelist' && !isInSingle) ||
            (filter_mode === 'blocklist' && isInSingle)
        )
            return next()

        const isInRange = await Promise.all(
            rangeIPs.map(async (range) => {
                return isIPInRange(clientIP, range)
            }),
        ).then((results) => results.some((result) => result))

        if (
            (filter_mode === 'whitelist' && !isInRange) ||
            (filter_mode === 'blocklist' && isInRange)
        )
            return res.status(401).send()
        return next()
    } catch (err) {
        logger.error(err)
    }
    res.status(401).send()
}

export default IPAddressFilter
