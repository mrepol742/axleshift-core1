import { ObjectId } from 'mongodb'
import express from 'express'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import auth from '../../middleware/auth.js'
import recaptcha from '../../middleware/recaptcha.js'

const router = express.Router()

const generateRandomData = () => {
    const couriers = ['shoppe', 'lazada', 'jnt', 'xpress', 'ninja']
    const currencies = ['PH', 'USD', 'SGD', 'MYR']
    const types = ['air', 'land', 'sea']
    const modes = {
        air: ['airplane', 'helicopter', 'drone'],
        land: ['truck', 'van', 'bike', 'car'],
        sea: ['ship', 'boat', 'cargo ship'],
    }

    const data = []

    for (let i = 0; i < 50; i++) {
        const type = types[Math.floor(Math.random() * types.length)]
        const mode = modes[type][Math.floor(Math.random() * modes[type].length)]
        const distance = Math.floor(Math.random() * (5000 - 100) + 100)
        const weight = Math.floor(Math.random() * (100 - 5) + 5)
        const cost = Math.floor(Math.random() * (20000 - 1000) + 1000)
        const courier = couriers[Math.floor(Math.random() * couriers.length)]
        const currency = currencies[Math.floor(Math.random() * currencies.length)]

        data.push({
            distance,
            weight,
            courier,
            cost,
            currency,
            type,
            mode: [mode],
        })
    }

    return data
}

/**
 * Get all Rates
 */
router.get('/', auth, async (req, res) => {
    try {
        // const db = await database()
        // const response = await db
        //     .collection('rates')
        //     .find({})
        //     .toArray()
        return res.status(200).json(generateRandomData())
    } catch (err) {
        logger.error(err)
    }
    res.status(500).send()
})

export default router
