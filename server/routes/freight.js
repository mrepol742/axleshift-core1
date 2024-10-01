import dotenv from 'dotenv'
dotenv.config()
import { ObjectId } from 'mongodb'
import express from 'express'
import connectToDatabase from '../models/db.js'
import auth from '../middleware/auth.js'
import { getUserId } from  '../src/sessions.js'

const router = express.Router()

/*
  Url: POST /api/freight
  Params:
     token
  Returns:
     status
     data
*/
router.post('/', auth, async (req, res) => {
    const token = req.token
    const user_id = await getUserId(token)

    const db = await connectToDatabase();
    const freightCollection = db.collection('freight')

    const items = await freightCollection.find({ user_id: new ObjectId(user_id) }).toArray();
    res.json({ status: 200, data: items})
})

/*
  Url: POST /api/freight/b/:type
  Type:
     [air, land, sea]
  Params:
     shipper
     consignee
     shipment
     shipping
     token
  Returns:
     status
*/
router.post('/b/:type', auth, async (req, res) => {
    const { shipper, consignee, shipment, shipping } = req.body
    const type = req.params.type
    if (!shipper || !consignee || !shipment || !shipping || !type) return res.json({ status: 401 })
    if (!['air', 'land', 'sea'].includes(type)) return res.json({ status: 401 })

    const user_id = await getUserId(req.token)
    const db = await connectToDatabase();

    const freightCollection = db.collection('freight')
    await freightCollection.insertOne({
        user_id: user_id,
        data: {
            shipper: shipper,
            consignee: consignee,
            shipment: shipment,
            shipping: shipping,
        },
        type: type,
        created_at: new Date(),
        updated_at: new Date(),
    })
    res.json({ status: 201 })
})

export default router
