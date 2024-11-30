import express from 'express'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import auth from '../../middleware/auth.js'

const router = express.Router()

/**
 * Get all Freight schedules
 */
router.get('/', auth, async (req, res) => {
    try {
        const db = await database()
        const freightCollection = db.collection('freight')
        const isUser = !['super_admin', 'admin', 'staff'].includes(req.user.role)

        const filter = {
            status: { $ne: 'canceled' },
            ...(isUser ? { user_id: req.user._id } : {}),
        }
        const freight = await freightCollection.find(filter).sort({ created_at: -1 }).toArray()

        const events = []

        const _datein = {
            sea: 'shipping_sailing_date',
            air: 'shipping_preferred_departure_date',
            land: 'shipping_pickup_date',
        }

        const _dateout = {
            sea: 'shipping_estimated_arrival_date',
            air: 'shipping_preferred_arrival_date',
            land: 'shipping_delivery_date',
        }

        for (let i = 0; i < freight.length; i++) {
            events.push({
                title: freight[i].data.shipment.shipment_description,
                start: freight[i].data.shipping[_datein[freight[i].type]],
                end: freight[i].data.shipping[_dateout[freight[i].type]],
                allDay: false,
            })
        }
        return res.status(200).json(events)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

export default router
