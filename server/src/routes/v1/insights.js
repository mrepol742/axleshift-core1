import express from 'express'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import auth from '../../middleware/auth.js'

const router = express.Router()

router.get('/shipment-overtime', auth, async (req, res) => {
    const db = await database()
    const freightCollection = db.collection('freight')

    try {
        const now = new Date()
        const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1)
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        const isUser = req.user ? !['super_admin', 'admin', 'staff'].includes(req.user.role) : null

        const filter = {
            status: { $ne: 'cancelled' },
            ...(isUser ? { user_id: req.user._id } : {}),
            created_at: {
                $gte: startDate.getTime(),
                $lt: endDate.getTime(),
            },
        }

        const shipmentsOverTime = await freightCollection
            .aggregate([
                {
                    $match: {
                        ...filter,
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m',
                                date: { $toDate: '$created_at' },
                            },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ])
            .toArray()
        const labels = []
        const data = []

        for (let i = 0; i < 6; i++) {
            const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth() + i)
            const label = currentMonth.toLocaleString('default', { month: 'long' })
            labels.push(label)

            const monthData = shipmentsOverTime.find((item) => {
                const [year, month] = item._id.split('-')
                return (
                    parseInt(year) === currentMonth.getFullYear() &&
                    parseInt(month) === currentMonth.getMonth() + 1
                )
            })

            data.push(monthData ? monthData.count : 0)
        }

        res.status(200).json({ labels, data })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/cost-overtime', auth, async (req, res) => {
    const db = await database()
    const freightCollection = db.collection('freight')

    try {
        const now = new Date()
        const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1)
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        const isUser = req.user ? !['super_admin', 'admin', 'staff'].includes(req.user.role) : null

        const filter = {
            status: { $ne: 'cancelled' },
            ...(isUser ? { user_id: req.user._id } : {}),
            created_at: {
                $gte: startDate.getTime(),
                $lt: endDate.getTime(),
            },
        }

        const costsOverTime = await freightCollection
            .aggregate([
                {
                    $match: {
                        ...filter,
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m',
                                date: { $toDate: '$created_at' },
                            },
                        },
                        totalCost: { $sum: '$amount.value' },
                    },
                },
                { $sort: { _id: 1 } },
            ])
            .toArray()
        const labels = []
        const data = []

        for (let i = 0; i < 6; i++) {
            const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth() + i)
            const label = currentMonth.toLocaleString('default', { month: 'long' })
            labels.push(label)

            const monthData = costsOverTime.find((item) => {
                const [year, month] = item._id.split('-')
                return (
                    parseInt(year) === currentMonth.getFullYear() &&
                    parseInt(month) === currentMonth.getMonth() + 1
                )
            })

            data.push(monthData ? monthData.totalCost : 0)
        }

        res.status(200).json({ labels, data })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/items-overtime', auth, async (req, res) => {
    const db = await database()
    const freightCollection = db.collection('freight')

    try {
        const now = new Date()
        const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1)
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        const isUser = req.user ? !['super_admin', 'admin', 'staff'].includes(req.user.role) : null

        const filter = {
            status: { $ne: 'cancelled' },
            ...(isUser ? { user_id: req.user._id } : {}),
            created_at: {
                $gte: startDate.getTime(),
                $lt: endDate.getTime(),
            },
        }

        const costsOverTime = await freightCollection
            .aggregate([
                {
                    $match: {
                        ...filter,
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m',
                                date: { $toDate: '$created_at' },
                            },
                        },
                        totalCost: { $sum: '$number_of_items' },
                    },
                },
                { $sort: { _id: 1 } },
            ])
            .toArray()
        const labels = []
        const data = []

        for (let i = 0; i < 6; i++) {
            const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth() + i)
            const label = currentMonth.toLocaleString('default', { month: 'long' })
            labels.push(label)

            const monthData = costsOverTime.find((item) => {
                const [year, month] = item._id.split('-')
                return (
                    parseInt(year) === currentMonth.getFullYear() &&
                    parseInt(month) === currentMonth.getMonth() + 1
                )
            })

            data.push(monthData ? monthData.totalCost : 0)
        }

        res.status(200).json({ labels, data })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/weight-overtime', auth, async (req, res) => {
    const db = await database()
    const freightCollection = db.collection('freight')

    try {
        const now = new Date()
        const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1)
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        const isUser = req.user ? !['super_admin', 'admin', 'staff'].includes(req.user.role) : null

        const filter = {
            status: { $ne: 'cancelled' },
            ...(isUser ? { user_id: req.user._id } : {}),
            created_at: {
                $gte: startDate.getTime(),
                $lt: endDate.getTime(),
            },
        }

        const costsOverTime = await freightCollection
            .aggregate([
                {
                    $match: {
                        ...filter,
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m',
                                date: { $toDate: '$created_at' },
                            },
                        },
                        totalCost: { $sum: '$total_weight' },
                    },
                },
                { $sort: { _id: 1 } },
            ])
            .toArray()
        const labels = []
        const data = []

        for (let i = 0; i < 6; i++) {
            const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth() + i)
            const label = currentMonth.toLocaleString('default', { month: 'long' })
            labels.push(label)

            const monthData = costsOverTime.find((item) => {
                const [year, month] = item._id.split('-')
                return (
                    parseInt(year) === currentMonth.getFullYear() &&
                    parseInt(month) === currentMonth.getMonth() + 1
                )
            })

            data.push(monthData ? monthData.totalCost : 0)
        }

        res.status(200).json({ labels, data })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/shipment-info-widgets', auth, async (req, res) => {
    const db = await database()
    const freightCollection = db.collection('freight')

    try {
        const isUser = req.user ? !['super_admin', 'admin', 'staff'].includes(req.user.role) : null
        const filter = isUser ? { user_id: req.user._id } : {}

        const totalShipments = await freightCollection.countDocuments(filter)
        const cancelledShipments = await freightCollection.countDocuments({
            ...filter,
            status: 'cancelled',
        })
        const toPayShipments = await freightCollection.countDocuments({
            ...filter,
            status: 'to_pay',
        })
        const toShipShipments = await freightCollection.countDocuments({
            ...filter,
            status: 'to_ship',
        })
        const toReceiveShipments = await freightCollection.countDocuments({
            ...filter,
            status: 'to_receive',
        })
        const receivedShipments = await freightCollection.countDocuments({
            ...filter,
            status: 'received',
        })

        const cancelledPercentage =
            totalShipments > 0 ? (cancelledShipments / totalShipments) * 100 : 0
        const toPay = totalShipments > 0 ? (toPayShipments / totalShipments) * 100 : 0
        const toShipPercentage = totalShipments > 0 ? (toShipShipments / totalShipments) * 100 : 0
        const toReceivePercentage =
            totalShipments > 0 ? (toReceiveShipments / totalShipments) * 100 : 0
        const receivedPercentage =
            totalShipments > 0 ? (receivedShipments / totalShipments) * 100 : 0

        res.status(200).json({
            cancelled: [cancelledShipments, `${cancelledPercentage.toFixed(2)}%`],
            toPay: [toPayShipments, `${toPay.toFixed(2)}%`],
            toShip: [toShipShipments, `${toShipPercentage.toFixed(2)}%`],
            toReceive: [toReceiveShipments, `${toReceivePercentage.toFixed(2)}%`],
            received: [receivedShipments, `${receivedPercentage.toFixed(2)}%`],
        })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/invoices-info-widgets', auth, async (req, res) => {
    const db = await database()
    const invoicesCollection = db.collection('invoices')

    try {
        const isUser = req.user ? !['super_admin', 'admin', 'staff'].includes(req.user.role) : null
        const filter = isUser ? { user_id: req.user._id } : {}

        const totalInvoices = await invoicesCollection.countDocuments(filter)
        const expiredInvoices = await invoicesCollection.countDocuments({
            ...filter,
            status: 'EXPIRED',
        })
        const successfullInvoices = totalInvoices - expiredInvoices

        const successfulPercentage =
            totalInvoices > 0 ? (successfullInvoices / totalInvoices) * 100 : 0
        const expiredPercentage = totalInvoices > 0 ? (expiredInvoices / totalInvoices) * 100 : 0

        res.status(200).json({
            success: [successfulPercentage, `${successfulPercentage.toFixed(2)}%`],
            expired: [expiredPercentage, `${expiredPercentage.toFixed(2)}%`],
        })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

export default router
