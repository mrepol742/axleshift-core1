import { ObjectId } from 'mongodb'
import express from 'express'
import { Xendit } from 'xendit-node'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import auth from '../../middleware/auth.js'
import freight from '../../middleware/freight.js'
import invoices from '../../middleware/invoices.js'
import recaptcha from '../../middleware/recaptcha.js'
import { NODE_ENV } from '../../config.js'
import activity from '../../components/activity.js'
import address from '../../middleware/address.js'

const router = express.Router()
const limit = 20

/**
 * Get all addresses
 */
router.post('/', auth, async (req, res) => {
    try {
        return res.status(200).send({})
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Get address by ID
 */
router.get('/id', [auth, address], async (req, res) => {
    try {
        return res.status(200).send({})
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Create an address
 */
router.post('/', [recaptcha, auth], async (req, res) => {
    try {
        return res.status(200).send({})
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Update an address
 */
router.post('/update/:id', [recaptcha, auth, address], async (req, res) => {
    try {
        return res.status(200).send({})
    } catch (err) {
        logger.error(err)
    }
    res.status(500).json({ error: 'Internal server error' })
})

/**
 * Remove a address
 */
router.post('/remove/:id', [recaptcha, auth, address], async (req, res, next) => {
    try {
        return res.status(200).send({})
    } catch (e) {
        logger.error(e)
    }
    res.status(500).json({ error: 'Internal server error' })
})

export default router
