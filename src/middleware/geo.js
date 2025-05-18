import { getCache } from '../models/redis.js'
import logger from '../utils/logger.js'
import haversineDistance from '../utils/haversineDistance.js'

/**
 * Filter requests, whitelist or blacklist based on geolocation.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {Promise<void>}
 */
const GeoLocationFilter = async (req, res, next) => {
    try {
        let { location } = req.body
        if (!location) return next()
        const geoFilter = await getCache('geo')
        if (!geoFilter) return next()
        location = JSON.parse(location)
        const { filter_mode, geo } = geoFilter
        const { latitude, longitude } = location
        if (!latitude || !longitude) return next()
        const isAllowed = filter_mode === 'whitelist' ? true : false
        for (const { latitude: lat, longitude: lon } of geo) {
            if (haversineDistance(latitude, longitude, lat, lon) <= 10) {
                if (isAllowed) return next()
                return res
                    .status(401)
                    .send({ error: 'Access denied due to location restrictions.' })
            }
        }

        return next()
    } catch (err) {
        logger.error(err)
    }
    res.status(401).send()
}

export default GeoLocationFilter
