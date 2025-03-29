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

        const shipmentsOverTime = await freightCollection.aggregate([
            {
                $match: {
                    created_at: {
                        $gte: startDate.getTime(),
                        $lt: endDate.getTime()
                    }
                }
            },
            {
                $group: {
                    _id: { 
                        $dateToString: { 
                            format: "%Y-%m", 
                            date: { $toDate: "$created_at" }
                        } 
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray()
        const labels = []
        const data = []

        for (let i = 0; i < 6; i++) {
            const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth() + i)
            const label = currentMonth.toLocaleString('default', { month: 'long' })
            labels.push(label)

            const monthData = shipmentsOverTime.find(item => {
            const [year, month] = item._id.split('-')
            return parseInt(year) === currentMonth.getFullYear() && parseInt(month) === currentMonth.getMonth() + 1
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

        const costsOverTime = await freightCollection.aggregate([
            {
            $match: {
                created_at: {
                $gte: startDate.getTime(),
                $lt: endDate.getTime()
                }
            }
            },
            {
            $group: {
                _id: { 
                $dateToString: { 
                    format: "%Y-%m", 
                    date: { $toDate: "$created_at" }
                } 
                },
                totalCost: { $sum: "$amount.value" }
            }
            },
            { $sort: { _id: 1 } }
        ]).toArray()
        const labels = []
        const data = []

        for (let i = 0; i < 6; i++) {
            const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth() + i)
            const label = currentMonth.toLocaleString('default', { month: 'long' })
            labels.push(label)

            const monthData = costsOverTime.find(item => {
            const [year, month] = item._id.split('-')
            return parseInt(year) === currentMonth.getFullYear() && parseInt(month) === currentMonth.getMonth() + 1
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

        const costsOverTime = await freightCollection.aggregate([
            {
            $match: {
                created_at: {
                $gte: startDate.getTime(),
                $lt: endDate.getTime()
                }
            }
            },
            {
            $group: {
                _id: { 
                $dateToString: { 
                    format: "%Y-%m", 
                    date: { $toDate: "$created_at" }
                } 
                },
                totalCost: { $sum: "$number_of_items" }
            }
            },
            { $sort: { _id: 1 } }
        ]).toArray()
        const labels = []
        const data = []

        for (let i = 0; i < 6; i++) {
            const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth() + i)
            const label = currentMonth.toLocaleString('default', { month: 'long' })
            labels.push(label)

            const monthData = costsOverTime.find(item => {
            const [year, month] = item._id.split('-')
            return parseInt(year) === currentMonth.getFullYear() && parseInt(month) === currentMonth.getMonth() + 1
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

        const costsOverTime = await freightCollection.aggregate([
            {
            $match: {
                created_at: {
                $gte: startDate.getTime(),
                $lt: endDate.getTime()
                }
            }
            },
            {
            $group: {
                _id: { 
                $dateToString: { 
                    format: "%Y-%m", 
                    date: { $toDate: "$created_at" }
                } 
                },
                totalCost: { $sum: "$total_weight" }
            }
            },
            { $sort: { _id: 1 } }
        ]).toArray()
        const labels = []
        const data = []

        for (let i = 0; i < 6; i++) {
            const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth() + i)
            const label = currentMonth.toLocaleString('default', { month: 'long' })
            labels.push(label)

            const monthData = costsOverTime.find(item => {
            const [year, month] = item._id.split('-')
            return parseInt(year) === currentMonth.getFullYear() && parseInt(month) === currentMonth.getMonth() + 1
            })

            data.push(monthData ? monthData.totalCost : 0)
        }

        res.status(200).json({ labels, data })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/successfull-shipment', auth, async (req, res) => {
    const db = await database()
    const freightCollection = db.collection('freight')

    try {
        const now = new Date()
        const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1)
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1) 

        const costsOverTime = await freightCollection.aggregate([
            {
            $match: {
                created_at: {
                $gte: startDate.getTime(),
                $lt: endDate.getTime()
                }
            }
            },
            {
            $group: {
                _id: { 
                $dateToString: { 
                    format: "%Y-%m", 
                    date: { $toDate: "$created_at" }
                } 
                },
                totalCost: { $sum: "$total_weight" }
            }
            },
            { $sort: { _id: 1 } }
        ]).toArray()
        const labels = []
        const data = []

        for (let i = 0; i < 6; i++) {
            const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth() + i)
            const label = currentMonth.toLocaleString('default', { month: 'long' })
            labels.push(label)

            const monthData = costsOverTime.find(item => {
            const [year, month] = item._id.split('-')
            return parseInt(year) === currentMonth.getFullYear() && parseInt(month) === currentMonth.getMonth() + 1
            })

            data.push(monthData ? monthData.totalCost : 0)
        }

        res.status(200).json({ labels, data })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})


export default router
