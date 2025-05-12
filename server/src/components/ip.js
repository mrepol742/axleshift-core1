/**
 * Retrieves the client's IP address from the request object.
 * 
 * @param {Object} req 
 * @return {string}
 */
export const getClientIp = (req) => {
    return req.headers['x-forwarded-for']
        ? req.headers['x-forwarded-for'].split(',')[0]
        : req.socket.remoteAddress
}
