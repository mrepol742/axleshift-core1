import { ObjectId } from 'mongodb'
import express from 'express'
import logger from '../../components/logger.js'
import database from '../../models/mongodb.js'
import auth from '../../middleware/auth.js'
import recaptcha from '../../middleware/recaptcha.js'
import freight from '../../middleware/freight.js'
import { send } from '../../components/mail.js'
import activity from '../../components/activity.js'

const router = express.Router()
const limit = 20

/*
  Get all freight shipment
  Url: POST /api/v1/freight
  Header:
     Authentication
  Request Body:
     Page
  Returns:
     Data
     Total pages
     Current page
*/
// TODO: integrate search function here!
router.post('/', auth, async (req, res, next) => {
    try {
        // if (!req.user) return res.status(401).send()
        const { page, query, status, type } = req.body
        if (!page) return res.status(400).send()
        const current_page = parseInt(page) || 1
        const skip = (current_page - 1) * limit

        let filter
        if (!query) {
            filter = req.user.role !== 'admin' ? { user_id: req.user._id } : {}
        } else {
            const deep_filter = {
                $or: [
                    // Shipper Fields
                    { 'data.shipper.shipper_company_name': query },
                    { 'data.shipper.shipper_contact_name': query },
                    { 'data.shipper.shipper_contact_email_address': query },
                    { 'data.shipper.shipper_contact_phone_number': query },
                    { 'data.shipper.shipper_company_address': query },

                    // Consignee Fields
                    { 'data.consignee.consignee_company_name': query },
                    { 'data.consignee.consignee_contact_name': query },
                    { 'data.consignee.consignee_contact_email_address': query },
                    { 'data.consignee.consignee_contact_phone_number': query },
                    { 'data.consignee.consignee_company_address': query },

                    // Shipment Fields
                    { 'data.shipment.shipment_description': query },
                    { 'data.shipment.shipment_weight': query },
                    { 'data.shipment.shipment_dimension_length': query },
                    { 'data.shipment.shipment_dimension_width': query },
                    { 'data.shipment.shipment_dimension_height': query },
                    { 'data.shipment.shipment_volume': query },
                    { 'data.shipment.shipment_value': query },
                    { 'data.shipment.shipment_instructions': query },

                    // Shipping Air Fields
                    { 'data.shipping.shipping_origin_airport': query },
                    { 'data.shipping.shipping_destination_airport': query },
                    { 'data.shipping.shipping_preferred_departure_date': query },
                    { 'data.shipping.shipping_preferred_arrival_date': query },
                    { 'data.shipping.shipping_flight_type': query },

                    // Shipping Land Fields
                    { 'data.shipping.shipping_origin_addresss': query },
                    { 'data.shipping.shipping_destination_address': query },
                    { 'data.shipping.shipping_pickup_date': query },
                    { 'data.shipping.shipping_delivery_date': query },
                    { 'data.shipping.shipping_vehicle_type': query },

                    // Shipping Sea Fields
                    { 'data.shipping.shipping_loading_port': query },
                    { 'data.shipping.shipping_discharge_port': query },
                    { 'data.shipping.shipping_sailing_date': query },
                    { 'data.shipping.shipping_estimated_arrival_date': query },
                    { 'data.shipping.shipping_cargo_type': query },
                ],
            }
            if (status && ['to_pay', 'to_ship', 'to_receive', 'recieved', 'cancelled'].includes(status)) 
                deep_filter.$or.push({ status: query });
            if (type && ['air', 'land', 'sea'].includes(type)) 
                deep_filter.$or.push({ type: query })

            filter =
                req.user.role !== 'admin'
                    ? { user_id: req.user._id, ...deep_filter }
                    : { ...deep_filter }
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

/*
  Get specific info on freight shipment tracking id
  Url: POST /api/v1/freight/:id
  Header:
     Authentication
  Params:
     Freight id
  Returns:
     Data

  Example:
     curl -H "Authorization: Bearer apiKey" http://{base-url}/api/v1/freight/{tracking-id}
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

/*
  Book a shipment
  Url: POST /api/v1/freight/b/:type
  Header:
     Authentication
  Params:
     Freight type
  Request Body:
     Shipper
     Consignee
     Shipment
     Shipping
*/
router.post('/b/:type', [recaptcha, auth], async (req, res, next) => {
    try {
        const { shipper, consignee, shipment, shipping } = req.body
        const type = req.params.type
        if (!shipper || !consignee || !shipment || !type || !shipping) return res.status(400).send()
        if (!['air', 'land', 'sea'].includes(type)) return res.status(400).send()

        const db = await database()
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
            created_at: Date.now(),
            updated_at: Date.now(),
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

/*
  Update a shipment
  Url: POST /api/v1/freight/u/:type/:id
  Header:
     Authentication
  Params:
     Freight type
     Freight id
  Request Body:
     Shipper
     Consignee
     Shipment
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

/*
  Delete a shipment
  Url: POST /api/v1/freight/c/:id
  Params:
     Freight id
  Header:
     Authentication
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

export default router
