import { ObjectId } from 'mongodb'
import express from 'express'
import logger from '../../utils/logger.js'
import database from '../../models/mongodb.js'
import auth from '../../middleware/auth.js'
import recaptcha from '../../middleware/recaptcha.js'
import freight from '../../middleware/freight.js'

const router = express.Router()

/**
 * Get Freight Tracking Status
 */
router.get('/:id', [auth, freight], async (req, res, next) => {
    try {
        const freight = req.freight

        const events = []
        events.push({
            date: freight.created_at,
            description: 'Freight is placed',
        })
        if (freight.created_at !== freight.updated_at)
            events.push({
                data: freight.updated_at,
                description: 'Freight info was updated',
            })

        /*-----------------------------------*/
        /*   THIS IS A TEST                  */
        /*-----------------------------------*/
        events.push({
            date: freight.created_at,
            description: 'We are preparing to ship your shipment',
        })
        events.push({
            date: freight.created_at,
            description: 'Freight has arrived on our ports in China',
        })

        const markerPositions = [
            // very big bridge?
            { lat: 37.7749, lng: -122.4194 },
            // lost angles
            { lat: 34.0522, lng: -118.2437 },
            // the concrete jungle hehe
            { lat: 40.7128, lng: -74.006 },
        ]

        return res.status(200).json({
            events: events,
            origin: `${freight.from[0].address} ${freight.from[0].city}, ${freight.from[0].country} ${freight.from[0].zip_code}`,
            destination: `${freight.to[0].address} ${freight.to[0].city}, ${freight.to[0].country} ${freight.to[0].zip_code}`,
            status: freight.status,
            markerPositions: markerPositions,
        })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
