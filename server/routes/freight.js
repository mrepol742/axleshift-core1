import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bcryptjs from 'bcryptjs'
import connectToDatabase from '../models/db.js'
import logger from '../logger.js'

const router = express.Router()

router.get('/', async (req, res) => {})

router.post('/', async (req, res) => {
    const { shipper, consignee, shipment, shipping } = req.body
    if (!shipper && !consignee && !shipment && !shipping) return res.json({ status: 401 })

    const db = await connectToDatabase()
    const collection = db.collection('freight')
})

export default router
