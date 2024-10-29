import { ObjectId } from 'mongodb'
import express from 'express'
import logger from '../../components/logger.js'
import database from '../../models/mongodb.js'
import auth from '../../middleware/auth.js'
import recaptcha from '../../middleware/recaptcha.js'

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
        if (!req.user) return res.status(401).send()
        const page = parseInt(req.body.page) || 1
        const skip = (page - 1) * limit

        const db = await database()
        const freightCollection = db.collection('freight')

        const [totalItems, items] = await Promise.all([
            freightCollection.countDocuments({ user_id: new ObjectId(req.user._id) }),
            freightCollection
                .find(req.user.role !== 'admin' ? { user_id: new ObjectId(req.user._id) } : {})
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
        ])

        return res.status(200).json({
            data: items,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
        })
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
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
router.get('/:id', auth, async (req, res, next) => {
    try {
        const id = req.params.id

        const db = await database()
        const freight = await db.collection('freight').findOne({ _id: new ObjectId(id) })
        if (!freight) return res.status(404).send()

        return res.status(200).json({
            data: freight,
        })
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
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
router.post('/b/:type', [auth, recaptcha], async (req, res, next) => {
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
            created_at: Date.now(),
            updated_at: Date.now(),
        })
        return res.status(201).send()
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
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
router.post('/u/:type/:id', auth, async (req, res, next) => {
    try {
        const { shipper, consignee, shipment } = req.body
        const { type, id } = req.params
        if (!shipper || !consignee || !shipment) return res.status(400).send()
        if (!['air', 'land', 'sea'].includes(type)) return res.status(400).send()

        const db = await database()
        const freightCollection = db.collection('freight')
        const freight = await freightCollection.findOne({ _id: new ObjectId(id) })
        if (!freight) return res.status(404).send()

        await freightCollection.updateOne(
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

        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
})

/*
  Delete a shipment
  Url: POST /api/v1/freight/u/:type/:id
  Params:
     Freight type
     Freight id
  Header:
     Authentication
*/
router.post('/d/:id', auth, async (req, res, next) => {
    try {
        const id = req.params.id
        const db = await database()

        const freightCollection = db.collection('freight')

        const freight = await freightCollection.findOne({ _id: new ObjectId(id) })
        if (!freight) return res.status(404).send()

        await freightCollection.deleteOne({ _id: new ObjectId(id) })
        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    return res.status(500).send()
})

export default router
