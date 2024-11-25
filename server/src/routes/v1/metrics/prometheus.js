import express from 'express'
import { collectDefaultMetrics, Registry, Counter, Gauge } from 'prom-client'
import auth from '../../../middleware/auth.js'
import logger from '../../../components/logger.js'

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
    if (req.path !== '/prometheus') return next()
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

router.get('/prometheus', auth, async (req, res) => {
    try {
        const metrics = await registry.metrics()

        const metricsJson = {}
        metrics.split('\n').forEach((line) => {
            if (line && line.includes('{')) {
                const metricName = line.split('{')[0].trim()
                metricsJson[metricName] = metricsJson[metricName] || []
                metricsJson[metricName].push(line)
            } else if (line && !line.startsWith('#')) {
                const [metricName, value] = line.split(' ')
                metricsJson[metricName] = metricsJson[metricName] || []
                metricsJson[metricName].push({ value: parseFloat(value) })
            }
        })

        return res.json(metricsJson)
    } catch (err) {
        logger.error(err)
    }
    res.status(500).send()
})

export default router
