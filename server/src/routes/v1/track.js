import { ObjectId } from 'mongodb'
import express from 'express'
import logger from '../../components/logger.js'
import database from '../../models/mongodb.js'
import auth from '../../middleware/auth.js'
import recaptcha from '../../middleware/recaptcha.js'

const router = express.Router()

/*
  Get tracking status of shipment
  Url: POST /api/v1/track/:id
  Params:
     Shipment Id
  Header:
     Authentication
  Returns:
     Events
     Origin
     Destination
     Status
*/
router.get('/:id', auth, async (req, res, next) => {
    try {
        const id = req.params.id

        const db = await database()
        const freight = await db.collection('freight').findOne({ _id: new ObjectId(id) })
        if (!freight) return res.status(404).send()

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
            origin: freight.data.shipping.shipping_origin_addresss,
            destination: freight.data.shipping.shipping_destination_address,
            status: 'on route',
            markerPositions: markerPositions,
        })
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
})

export default router
