import { REACT_APP_ORIGIN } from '../config.js'

const ipwhitelist = async (req, res, next) => {
    if (REACT_APP_ORIGIN !== req.socket.remoteAddress) return res.status(403).send()
    return next()
}

export default ipwhitelist
