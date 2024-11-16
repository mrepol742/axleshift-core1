import express from 'express'
import { collectDefaultMetrics, Registry, Counter, Gauge } from 'prom-client'
import database from '../../models/mongodb.js'
import logger from '../../components/logger.js'
import auth from '../../middleware/auth.js'

const router = express.Router()
const registry = new Registry()
collectDefaultMetrics({ register: registry })

const requestCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'status_code'],
    registers: [registry],
})

const responseDuration = new Gauge({
    name: 'http_response_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'status_code'],
    registers: [registry],
})

router.use((req, res, next) => {
    const start = Date.now()

    res.on('finish', () => {
        requestCounter.inc({
            method: req.method,
            status_code: res.statusCode,
        })

        const duration = (Date.now() - start) / 1000
        responseDuration.set({ method: req.method, status_code: res.statusCode }, duration)
    })

    next()
})

router.get('/', async (req, res) => {
    res.set('Content-Type', registry.contentType)
    res.end(await registry.metrics())
})

export default router
