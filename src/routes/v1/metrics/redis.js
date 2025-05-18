import express from 'express'
import redis from '../../../models/redis.js'
import auth from '../../../middleware/auth.js'
import logger from '../../../utils/logger.js'

const router = express.Router()

router.get('/', auth, async (req, res) => {
    try {
        const redisClient = await redis()
        const info = await redisClient.info()

        const stats = {}

        const db0Match = info.match(/db0:keys=(\d+),expires=(\d+),avg_ttl=(\d+)/)
        if (db0Match) {
            stats.totalKeys = parseInt(db0Match[1], 10)
            stats.keysWithExpiry = parseInt(db0Match[2], 10)
            stats.avgTTLms = parseInt(db0Match[3], 10)
        }

        const usedMemoryMatch = info.match(/used_memory_human:([^\r\n]+)/)
        if (usedMemoryMatch) {
            stats.usedMemory = usedMemoryMatch[1]
        }

        const commandsMatch = info.match(/total_commands_processed:(\d+)/)
        if (commandsMatch) {
            stats.totalCommandsProcessed = parseInt(commandsMatch[1], 10)
        }

        const opsMatch = info.match(/instantaneous_ops_per_sec:(\d+)/)
        if (opsMatch) {
            stats.opsPerSec = parseInt(opsMatch[1], 10)
        }

        return res.json(stats)
    } catch (err) {
        logger.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

export default router
