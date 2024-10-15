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

    if (requestCounts[key].length >= getRateLimit(path)) return res.status(429).send();

    requestCounts[key].push(currentTime);
    next();
};

const getRateLimit = (path) => {
    if (limitedRequestRoute.includes(path)) return 5;
    return process.env.API_RATE_LIMIT;
};

export default rateLimiter;
