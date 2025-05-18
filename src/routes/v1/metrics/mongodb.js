import express from 'express'
import database from '../../../models/mongodb.js'
import auth from '../../../middleware/auth.js'
import logger from '../../../utils/logger.js'

const router = express.Router()

router.get('/', auth, async (req, res) => {
    try {
        const db = await database()
        const status = await db.admin().command({ serverStatus: 1 })

        const importantData = {
            oplog: status.metrics?.repl
                ? [
                      {
                          appliedBatches: status.metrics.repl.apply.batches.total,
                          networkBytes: status.metrics.repl.network.bytes,
                          getMoreOps: status.metrics.repl.network.getmores.num,
                      },
                  ]
                : null,
            connections: [
                {
                    current: status.connections.current,
                    available: status.connections.available,
                },
            ],
            operations: [status.opcounters],
        }

        return res.json(importantData)
    } catch (err) {
        logger.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

export default router
