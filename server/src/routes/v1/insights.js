import express from 'express'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import auth from '../../middleware/auth.js'

const router = express.Router()

router.post('/route-optimization', auth, async (req, res) => {
    res.status(501).send()
})

router.post('/freight-cost', auth, async (req, res) => {
    res.status(501).send()
})

router.post('/performance', auth, async (req, res) => {
    res.status(501).send()
})

export default router
