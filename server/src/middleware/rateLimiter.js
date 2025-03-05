import { getClientIp } from '../components/ip.js'
import logger from '../utils/logger.js'
import { API_RATE_LIMIT, API_EXTERNAL_RATE_LIMIT } from '../config.js'

const TIME_WINDOW = 60 * 3 * 1000
const requestCounts = {}
const exludeRoute = ['/api/v1/auth/verify', '/api/v1/metrics/prometheus']
const limitedRequestRoute = [
    '/api/v1/auth/login',
    '/api/v1/auth/register',
    '/api/v1/auth/user',
    '/api/v1/newsletter',
    '/api/v1/auth/token/new',
    '/api/v1/auth/verify/otp/new',
    '/api/v1/auth/verify/otp',
]
const exteralRequestRoute = ['/api/v1/freight/', '/api/v1/freight/:id']

const rateLimiter = (req, res, next) => {
    const path = req.path
    if (
        exludeRoute.includes(path) ||
        /^\/u\/.*\.png$/.test(path) ||
        /^\/[^/]+\.(jpg|ico)$/.test(path)
    )
        return next()

    const key = `${getClientIp(req)}-${path}`
    const currentTime = Date.now()
    if (!requestCounts[key]) requestCounts[key] = []

    requestCounts[key] = requestCounts[key].filter(
        (timestamp) => currentTime - timestamp < TIME_WINDOW,
    )

    const limit = getRateLimit(req)
    const remainingRequests = limit - requestCounts[key].length

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', limit)
    res.setHeader('X-RateLimit-Remaining', remainingRequests)
    res.setHeader(
        'X-RateLimit-Reset',
        Math.ceil((TIME_WINDOW - (currentTime - requestCounts[key][0] || currentTime)) / 1000),
    ) // Reset time in seconds

    if (remainingRequests <= 0) return res.status(429).json({ error: 'Rate limit exceeded' })

    requestCounts[key].push(currentTime)
    next()
}

const getRateLimit = (req) => {
    let path = req.path
    path = path.endsWith('/') ? path.slice(0, -1) : path
    if (limitedRequestRoute.includes(path)) return 5
    const authHeader = req.headers['authorization']
    const isAllowed = exteralRequestRoute.some((route) => {
        if (route === path) return true
        const regex = new RegExp(`^${route.replace(/:\w+/, '\\w+')}$`)
        return regex.test(path)
    })
    if (isAllowed || (authHeader && /^Bearer\score1_/.test(authHeader)))
        return API_EXTERNAL_RATE_LIMIT
    return API_RATE_LIMIT
}

export default rateLimiter
