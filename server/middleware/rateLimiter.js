const TIME_WINDOW = 60 * 1000;
const requestCounts = {};

const rateLimiter = (req, res, next) => {
    const path = req.path;
    if (["/api/auth/verify", "/api/auth/logout"].includes(path)) return next();

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const key = `${ip}-${path}`;

    const currentTime = Date.now();
    if (!requestCounts[key]) requestCounts[key] = [];

    requestCounts[key] = requestCounts[key].filter((timestamp) => currentTime - timestamp < TIME_WINDOW);

    if (requestCounts[key].length >= process.env.API_RATE_LIMIT) return res.status(429).send();

    requestCounts[key].push(currentTime);
    next();
};

export default rateLimiter;
