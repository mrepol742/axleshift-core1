import express from 'express'
import database from '../../../models/mongodb.js'
import logger from '../../../components/logger.js'
import auth from '../../../middleware/auth.js'
import recaptcha from '../../../middleware/recaptcha.js'

const router = express.Router()

router.get('/', auth, async (req, res) => {
    try {
        const db = await database()
        const session = await db
            .collection('sessions')
            .find({ user_id: req.user._id, active: true, compromised: false })
            .sort({ lastAccessed: -1 })
            .limit(1)
            .toArray()

        const activeSessionsCount = await db
            .collection('sessions')
            .countDocuments({ user_id: req.user._id, active: true, compromised: false })

        if (session)
            return res.status(200).json({ session: session[0], logout: !(activeSessionsCount > 1) })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

router.post('/logout', [recaptcha, auth], async (req, res) => {
    try {
        const db = await database()
        await db.collection('sessions').updateMany(
            {
                user_id: req.user._id,
                token: { $ne: req.token },
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
    return res.status(501).send()
})

export default router
