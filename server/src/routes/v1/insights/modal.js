import express from 'express'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import auth from '../../../middleware/auth.js'

const router = express.Router()

router.get('/:type', auth, async (req, res) => {
    const { type } = req.params
    if (!type || !['cancelled', 'to_pay', 'to_ship', 'to_receive', 'received'].includes(type)) return res.status(400).json({ error: 'Invalid request' })

    const db = await database()
    const freightCollection = db.collection('freight')

    try {
        const isUser = req.user ? !['super_admin', 'admin', 'staff'].includes(req.user.role) : null
        const filter = isUser ? { user_id: req.user._id } : {}

        const shipments = await freightCollection
            .find(
                { ...filter, status: type },
                { projection: { _id: 0, tracking_number: 1, created_at: 1, to: 1 } },
            )
            .sort({ created_at: -1 })
            .toArray()

        if (!shipments) return res.status(404).json({ error: 'No shipments found' })

        return res.status(200).json(shipments)
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

export default router
