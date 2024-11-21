import { ObjectId } from 'mongodb'
import express from 'express'
import database from '../../../models/mongodb.js'
import logger from '../../../components/logger.js'
import dependabot from '../../../components/dependabot.js'
import sentry from '../../../components/sentry.js'
import auth from '../../../middleware/auth.js'
import recaptcha from '../../../middleware/recaptcha.js'

const router = express.Router()

router.get('/', auth, async (req, res, next) => res.status(301).send())

router.get('/sessions', auth, async (req, res, next) => {
    try {
        const db = await database()
        const response = await db
            .collection('sessions')
            .find()
            .sort({ last_accessed: -1 })
            .toArray()
        return res.status(200).json(response)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

router.post('/sessions/logout', [recaptcha, auth], async (req, res, next) => {
    try {
        const db = await database()
        await db.collection('sessions').updateMany(
            {
                active: true,
            },
            {
                $set: {
                    active: false,
                    last_accessed: Date.now(),
                    modified_by: 'system',
                },
            },
        )
        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

router.get('/dependabot', auth, async (req, res, next) => {
    try {
        const response = await dependabot()
        return res.status(200).json(response)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

router.get('/sentry', auth, async (req, res, next) => {
    try {
        const response = await sentry()
        return res.status(200).json(response)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

router.get('/apikeys', auth, async (req, res, next) => {
    try {
        const db = await database()
        const apiTokenCollection = await db.collection('apiToken')

        const [apiToken, activeApiTokenCount] = await Promise.all([
            apiTokenCollection.find().sort({ created_at: -1 }).toArray(),
            apiTokenCollection.countDocuments({ active: true, compromised: false }),
        ])

        if (apiToken)
            return res.status(200).json({ apiToken: apiToken, deny: !(activeApiTokenCount > 1) })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

router.post('/apikeys/deactivate', [recaptcha, auth], async (req, res, next) => {
    try {
        const db = await database()
        await db.collection('apiToken').updateMany(
            {
                active: true,
            },
            {
                $set: {
                    active: false,
                    updated_at: Date.now(),
                    modified_by: 'system',
                },
            },
        )
        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

router.get('/activity', auth, async (req, res, next) => {
    try {
        const db = await database()
        const response = await db
            .collection('activityLog')
            .find()
            .sort({ last_accessed: -1 })
            .toArray()
        return res.status(200).json(response)
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

export default router
