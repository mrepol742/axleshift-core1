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

        return res.status(200).json({
            events: [
                {
                    date: freight.created_at,
                    event: 'Shipment is placed',
                },
                // all other tracking info will be here
            ],
            to: [
                {
                    name: freight.to[0].name,
                    phone_number: freight.to[0].phone_number,
                    email: freight.to[0].email,
                },
            ],
            origin: [
                {
                    address: freight.from[0].address,
                    city: freight.from[0].city,
                    country: freight.from[0].country,
                    zip_code: freight.from[0].zip_code,
                },
            ],
            destination: [
                {
                    address: freight.to[0].address,
                    city: freight.to[0].city,
                    country: freight.to[0].country,
                    zip_code: freight.to[0].zip_code,
                },
            ],
            status: freight.status,
        })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
