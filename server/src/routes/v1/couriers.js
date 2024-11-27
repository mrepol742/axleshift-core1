import { ObjectId } from 'mongodb'
import express from 'express'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import auth from '../../middleware/auth.js'
import recaptcha from '../../middleware/recaptcha.js'

const router = express.Router()

router.get('/', auth, async (req, res) => {
    try {
        // const db = await database()
        // const response = await db
        //     .collection('couriers')
        //     .find({})
        //     .toArray()
        return res.status(200).json([
            { name: 'xpress' },
            { name: 'ninja' },
            { name: 'lazada' },
            { name: 'shoppee' },
            { name: 'jnt' },
        ])
    } catch (err) {
        logger.error(err)
    }
    res.status(500).send()
})

export default router
