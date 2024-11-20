import express from 'express'
import database from '../../models/mongodb.js'
import logger from '../../components/logger.js'
import auth from '../../middleware/auth.js'

const router = express.Router()

router.post('/schudules', auth, async (req, res) => {
    res.status(501).send()
})

export default router
