import express from 'express'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import auth from '../../../middleware/auth.js'

const router = express.Router()

router.get('/:type', auth, async (req, res) => {
    const { type } = req.params
    if (!type || !['cancelled', 'to_pay', 'to_ship', 'to_receive', 'received', 'PAID', 'EXPIRED'].includes(type)) return res.status(400).json({ error: 'Invalid request' })

    const db = await database()
    const collection = db.collection(type === 'PAID' ? 'invoices' : 'freight')

    try {
        const isUser = req.user ? !['super_admin', 'admin', 'staff'].includes(req.user.role) : null
        const filter = isUser ? { user_id: req.user._id } : {}

        const data = await collection
            .find(
                { ...filter, status: type },
                { projection: { _id: 0, freight_tracking_number: 1, tracking_number: 1, created_at: 1, to: 1, amount: 1, currency: 1 } },
            )
            .sort({ created_at: -1 })
            .toArray()

        if (!data) return res.status(404).json([])

        return res.status(200).json(data)
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

export default router
