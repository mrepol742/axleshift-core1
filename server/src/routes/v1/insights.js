import express from 'express'
import database from '../../models/mongodb.js'
import logger from '../../utils/logger.js'
import auth from '../../middleware/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
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
                        $gte: qstartDate.getTime(),
                        $lt: qendDate.getTime()
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

        res.status(200).json({ shipmentsOverTime: { labels, data } })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

export default router
