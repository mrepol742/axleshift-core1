import dotenv from 'dotenv'
dotenv.config()
import { ObjectId } from 'mongodb'
import express from 'express'
import database from '../../models/db.js'
import logger from '../../components/logger.js'
import scm from '../../components/scm.js'
import sentry from '../../components/sentry.js'
import auth from '../../middleware/auth.js'
import { getUser } from '../../components/sessions.js'

const router = express.Router()

router.get('/', auth, async (req, res, next) => {
    const [_scm, _sentry, _sessions, _apiToken] = await Promise.all([
        scm(),
        sentry(),
        (async () => {
            const db = await database()

            const sessions = await db
                .collection('sessions')
                .find(req.user.role !== 'admin' ? { user_id: new ObjectId(req.user._id) } : {})
                .sort({ last_accessed: -1 })
                .toArray()

            return sessions
        })(),
        (async () => {
            const db = await database()

            const apiToken = await db.collection('apiToken').findOne({ user_id: req.user._id })

            return apiToken
        })(),
    ])

    return res
        .status(200)
        .json({ scm: _scm, sentry: _sentry, sessions: _sessions, apiToken: _apiToken })
})

router.get('/scan', auth, async (req, res, next) => {
    const [gds_advisory] = await Promise.all([scm()])

    return res.status(200).json({ scm: gds_advisory })
})

export default router
