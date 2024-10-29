import { REACT_APP_ORIGIN } from '../config.js'
import { getClientIp } from '../components/ip.js'

const ipwhitelist = async (req, res, next) => {
    let ip = getClientIp(req)
    if (REACT_APP_ORIGIN !== ip) return res.status(403).send()
    return next()
}

export default ipwhitelist
