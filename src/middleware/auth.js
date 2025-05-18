import crypto from 'crypto'
import validateInternalToken from '../components/token/internal.js'
import validateExternalToken from '../components/token/external.js'
import logger from '../utils/logger.js'

/**
 * Authenticate every request both external and internal.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {Promise<void>}
 */
const auth = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader)
        return res
            .status(401)
            .json({ error: 'Unauthorized', reason: 'Request denied missing authorization header' })

    const token = authHeader.split(' ')[1]
    if (!token)
        return res
            .status(401)
            .json({ error: 'Unauthorized', reason: 'Request denied missing bearer token' })
    // validate external token
    if (/^core1_[0-9a-f]{16}$/.test(token)) return validateExternalToken(req, res, next)
    if (!/^[0-9a-f]{32}$/.test(token)) return res.status(401).json({ error: 'Unauthorized' })
    return validateInternalToken(req, res, next)
}

export default auth
