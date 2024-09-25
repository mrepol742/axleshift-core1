import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bcryptjs from 'bcryptjs'
import connectToDatabase from '../models/db.js'
import logger from '../logger.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.get('/', auth, async (req, res) => {})

router.post('/', auth, async (req, res) => {
    const { shipper, consignee, shipment, shipping } = req.body
    if (!shipper && !consignee && !shipment && !shipping) return res.json({ status: 401 })

   logger.info(shipper)
})

export default router
