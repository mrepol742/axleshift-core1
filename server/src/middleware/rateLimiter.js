const TIME_WINDOW = 60 * 1000;
const requestCounts = {};
const exludeRoute = ["/api/v1/auth/verify"];
const limitedRequestRoute = ["/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/newsletter"];

const rateLimiter = (req, res, next) => {
    const path = req.path;
    if (exludeRoute.includes(path)) return next();

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const key = `${ip}-${path}`;

    const currentTime = Date.now();
    if (!requestCounts[key]) requestCounts[key] = [];

    requestCounts[key] = requestCounts[key].filter((timestamp) => currentTime - timestamp < TIME_WINDOW);

    const limit = getRateLimit(path);
    const remainingRequests = limit - requestCounts[key].length;

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remainingRequests);
    res.setHeader("X-RateLimit-Reset", Math.ceil((TIME_WINDOW - (currentTime - requestCounts[key][0] || currentTime)) / 1000)); // Reset time in seconds

    if (remainingRequests <= 0) return res.status(429).send();

    requestCounts[key].push(currentTime);
    next();
};

const getRateLimit = (path) => {
    if (limitedRequestRoute.includes(path)) return 5;
    return process.env.API_RATE_LIMIT;
};

export default rateLimiter;
