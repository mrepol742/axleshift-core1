import { REACT_APP_ORIGIN, NODE_ENV } from '../config.js'

const loopback = [
    '127.0.0.1', // IPv4
    '::1', // IPv6
    '::ffff:127.0.0.1', // IPv4-mapped IPv6
]

/**
 * Whitelist remote address for internal requests.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {Promise<void>}
 */
const ipwhitelist = async (req, res, next) => {
    if (
        (NODE_ENV === 'production' && REACT_APP_ORIGIN !== req.socket.remoteAddress) ||
        (NODE_ENV !== 'production' && !loopback.includes(req.socket.remoteAddress))
    )
        return res.status(403).send({ error: 'Forbidden' })
    return next()
}

export default ipwhitelist
