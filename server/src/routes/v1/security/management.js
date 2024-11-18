import { ObjectId } from 'mongodb'
import express from 'express'
import database from '../../../models/mongodb.js'
import logger from '../../../components/logger.js'
import scm from '../../../components/scm.js'
import sentry from '../../../components/sentry.js'
import auth from '../../../middleware/auth.js'

const router = express.Router()

router.get('/', auth, async (req, res, next) => {
    const [_scm, _sentry, _sessions, _apiTokens] = await Promise.all([
        scm(),
        sentry(),
        (async () => {
            const db = await database()
            return await db.collection('sessions').find().sort({ last_accessed: -1 }).toArray()
        })(),
        (async () => {
            const db = await database()
            return await db.collection('apiToken').find().sort({ last_accessed: -1 }).toArray()
        })(),
    ])

    return res.status(200).json({
        dashboard: [],
        sessions: _sessions,
        scm: _scm,
        sentry: _sentry,
        apiTokens: _apiTokens,
        activity: [],
        maintenance: [],
    })
})

export default router
