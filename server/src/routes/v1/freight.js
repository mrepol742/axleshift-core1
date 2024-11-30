import { ObjectId } from 'mongodb'
import express from 'express'
import axios from 'axios'
import logger from '../../utils/logger.js'
import database from '../../models/mongodb.js'
import auth from '../../middleware/auth.js'
import recaptcha from '../../middleware/recaptcha.js'
import freight from '../../middleware/freight.js'
import { send } from '../../components/mail.js'
import activity from '../../components/activity.js'
import { GOOGLE_MAP } from '../../config.js'

const router = express.Router()
const limit = 20

/**
 * Get all Freight Shipments & search
 */
router.post('/', auth, async (req, res, next) => {
    try {
        // if (!req.user) return res.status(401).send()
        const { page, query, status, type } = req.body
        if (!page) return res.status(400).send()
        const current_page = parseInt(page) || 1
        const skip = (current_page - 1) * limit
        const isUser = !['super_admin', 'admin', 'staff'].includes(req.user.role)

        let filter
        if (!query) {
            filter = isUser ? { user_id: req.user._id } : {}
        } else {
            const deep_filter = {
                $or: [
                    // Shipper Fields
                    { 'data.shipper.shipper_company_name': { $regex: query, $options: 'i' } },
                    { 'data.shipper.shipper_contact_name': { $regex: query, $options: 'i' } },
                    {
                        'data.shipper.shipper_contact_email_address': {
                            $regex: query,
                            $options: 'i',
                        },
                    },
                    {
                        'data.shipper.shipper_contact_phone_number': {
                            $regex: query,
                            $options: 'i',
                        },
                    },
                    { 'data.shipper.shipper_company_address': { $regex: query, $options: 'i' } },

                    // Consignee Fields
                    { 'data.consignee.consignee_company_name': { $regex: query, $options: 'i' } },
                    { 'data.consignee.consignee_contact_name': { $regex: query, $options: 'i' } },
                    {
                        'data.consignee.consignee_contact_email_address': {
                            $regex: query,
                            $options: 'i',
                        },
                    },
                    {
                        'data.consignee.consignee_contact_phone_number': {
                            $regex: query,
                            $options: 'i',
                        },
                    },
                    {
                        'data.consignee.consignee_company_address': {
                            $regex: query,
                            $options: 'i',
                        },
                    },

                    // Shipment Fields
                    { 'data.shipment.shipment_description': { $regex: query, $options: 'i' } },
                    { 'data.shipment.shipment_weight': { $regex: query, $options: 'i' } },
                    { 'data.shipment.shipment_dimension_length': { $regex: query, $options: 'i' } },
                    { 'data.shipment.shipment_dimension_width': { $regex: query, $options: 'i' } },
                    { 'data.shipment.shipment_dimension_height': { $regex: query, $options: 'i' } },
                    { 'data.shipment.shipment_volume': { $regex: query, $options: 'i' } },
                    { 'data.shipment.shipment_value': { $regex: query, $options: 'i' } },
                    { 'data.shipment.shipment_instructions': { $regex: query, $options: 'i' } },

                    // Shipping Air Fields
                    { 'data.shipping.shipping_origin_airport': { $regex: query, $options: 'i' } },
                    {
                        'data.shipping.shipping_destination_airport': {
                            $regex: query,
                            $options: 'i',
                        },
                    },
                    {
                        'data.shipping.shipping_preferred_departure_date': {
                            $regex: query,
                            $options: 'i',
                        },
                    },
                    {
                        'data.shipping.shipping_preferred_arrival_date': {
                            $regex: query,
                            $options: 'i',
                        },
                    },
                    { 'data.shipping.shipping_flight_type': { $regex: query, $options: 'i' } },

                    // Shipping Land Fields
                    { 'data.shipping.shipping_origin_addresss': { $regex: query, $options: 'i' } },
                    {
                        'data.shipping.shipping_destination_address': {
                            $regex: query,
                            $options: 'i',
                        },
                    },
                    { 'data.shipping.shipping_pickup_date': { $regex: query, $options: 'i' } },
                    { 'data.shipping.shipping_delivery_date': { $regex: query, $options: 'i' } },
                    { 'data.shipping.shipping_vehicle_type': { $regex: query, $options: 'i' } },

                    // Shipping Sea Fields
                    { 'data.shipping.shipping_loading_port': { $regex: query, $options: 'i' } },
                    { 'data.shipping.shipping_discharge_port': { $regex: query, $options: 'i' } },
                    { 'data.shipping.shipping_sailing_date': { $regex: query, $options: 'i' } },
                    {
                        'data.shipping.shipping_estimated_arrival_date': {
                            $regex: query,
                            $options: 'i',
                        },
                    },
                    { 'data.shipping.shipping_cargo_type': { $regex: query, $options: 'i' } },
                ],
            }
            if (
                status &&
                ['to_pay', 'to_ship', 'to_receive', 'recieved', 'cancelled'].includes(status)
            )
                deep_filter.$or.push({ status: query })
            if (type && ['air', 'land', 'sea'].includes(type)) deep_filter.$or.push({ type: query })

            filter = isUser ? { user_id: req.user._id, ...deep_filter } : { ...deep_filter }
        }

        const db = await database()
        const freightCollection = db.collection('freight')

        const [totalItems, items] = await Promise.all([
            freightCollection.countDocuments({ user_id: req.user._id }),
            freightCollection
                .find(filter)
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
        ])

        return res.status(200).json({
            data: items,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: current_page,
        })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

/**
 * Get Freight by freight id
 */
router.get('/:id', [auth, freight], async (req, res, next) => {
    try {
        // even tho there are 0.0000% changes this throws an error
        // i dont care
        // ait gonna dleete this try catch!
        return res.status(200).json({
            data: req.freight,
        })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

/**
 * Create a Freight shipment
 */
router.post('/b/:type', [recaptcha, auth], async (req, res, next) => {
    try {
        const { shipper, consignee, shipment, shipping } = req.body
        const type = req.params.type
        if (!shipper || !consignee || !shipment || !type || !shipping) return res.status(400).send()
        if (!['air', 'land', 'sea'].includes(type)) return res.status(400).send()

        const db = await database()
        const dateNow = Date.now()
        await db.collection('freight').insertOne({
            user_id: req.user._id,
            data: {
                shipper: shipper,
                consignee: consignee,
                shipment: shipment,
                shipping: shipping,
            },
            type: type,
            status: 'to_pay',
            session_id: req.session._id,
            created_at: dateNow,
            updated_at: dateNow,
        })
        send(
            {
                to: req.user.email,
                subject: 'Shipment has been created',
                text: `We have arranged your shipment schedules please proceed to payment so we can processed your shipment as soon as possible.<br><br>If you need assistance feel free to contact us.`,
            },
            req.user.first_name,
        )
        activity(req, `created a shipment`)
        return res.status(201).send()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

/**
 * Update freight details
 */
router.post('/u/:type/:id', [recaptcha, auth, freight], async (req, res, next) => {
    try {
        const { shipper, consignee, shipment } = req.body
        const { type, id } = req.params
        if (!shipper || !consignee || !shipment) return res.status(400).send()
        if (!['air', 'land', 'sea'].includes(type)) return res.status(400).send()

        const db = await database()
        await db.collection('freight').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    'data.shipper': shipper,
                    'data.consignee': consignee,
                    'data.shipment': shipment,
                    updated_at: Date.now(),
                    modified_by: req.user._id,
                },
            },
        )

        activity(req, `updated a shipment information #${id}`)
        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

/**
 * Cancel a Freight shipment
 */
router.post('/c/:id', [recaptcha, auth, freight], async (req, res, next) => {
    try {
        const id = req.params.id
        const db = await database()
        await db.collection('freight').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    status: 'cancelled',
                    updated_at: Date.now(),
                    modified_by: req.user._id,
                },
            },
        )

        activity(req, `cancelled a shipment #${id}`)
        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

router.post('/optimized-route', [auth], async (req, res, next) => {
    try {
        const { pickup, dropoff } = req.body

        const params = {
            origin: `${pickup.lat},${pickup.lng}`,
            destination: `${dropoff.lat},${dropoff.lng}`,
            waypoints: '',
            optimize_waypoints: true,
            key: GOOGLE_MAP,
        }

        const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            params,
        })
        return res.status(200).json(response.data)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

export default router
