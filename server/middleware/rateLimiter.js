const TIME_WINDOW = 60 * 1000

const requestCounts = {}

const rateLimiter = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    const currentTime = Date.now()
    if (!requestCounts[ip]) requestCounts[ip] = []

    requestCounts[ip] = requestCounts[ip].filter(timestamp => currentTime - timestamp < TIME_WINDOW)

    if (requestCounts[ip].length >= process.env.API_RATE_LIMIT) return res.status(429).json({ error: 'Too many requests' })

    requestCounts[ip].push(currentTime)
    next()
}

export default rateLimiter
