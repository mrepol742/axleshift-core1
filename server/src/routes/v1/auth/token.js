import { ObjectId } from 'mongodb'
import express from 'express'
import crypto from 'crypto'
import database from '../../../models/mongodb.js'
import logger from '../../../components/logger.js'
import auth from '../../../middleware/auth.js'
import recaptcha from '../../../middleware/recaptcha.js'
import activity from '../../../components/activity.js'

const router = express.Router()

router.get('/', auth, async function (req, res, next) {
    try {
        const db = await database()
        const apiToken = await db.collection('apiToken').findOne({ user_id: req.user._id })
        if (!apiToken) return res.status(200).json({ error: 'No API Token found' })

        return res.status(200).json({ token: apiToken.token, whitelist_ip: apiToken.whitelist_ip })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

router.post('/new', [recaptcha, auth], async function (req, res, next) {
    try {
        const db = await database()
        const apiTokenCollection = db.collection('apiToken')
        const apiToken = await apiTokenCollection.findOne({ user_id: req.user._id })
        const apiT = `core1_${crypto.randomBytes(8).toString('hex')}`

        if (apiToken) {
            await apiTokenCollection.updateOne(
                { _id: new ObjectId(apiToken._id) },
                {
                    $set: {
                        active: true,
                        token: apiT,
                        compromised: false,
                        updated_at: Date.now(),
                        modified_by: 'system',
                    },
                },
            )
            return res.status(200).json({ token: apiT })
        }
        await apiTokenCollection.insertOne({
            user_id: req.user._id,
            active: true,
            compromised: false,
            token: apiT,
            whitelist_ip: [],
            created_at: Date.now(),
            updated_at: Date.now(),
        })

        activity(req, 'generate new auth token')
        return res.status(200).json({ token: apiT })
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

router.post('/whitelist-ip', [recaptcha, auth], async function (req, res, next) {
    try {
        let whitelist_ip = req.body.whitelist_ip
        if (!whitelist_ip) return res.status(400).send()
        whitelist_ip = whitelist_ip.split(',')
        if (whitelist_ip.length > 6)
            return res.status(200).json({ error: 'Max number of whitelisted ip address reached' })
        for (let i = 0; i < whitelist_ip.length; i++) {
            if (!/^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?$/.test(whitelist_ip[i])) {
                if (
                    !/^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})(:\d{1,5})?$|^::([0-9a-fA-F]{1,4}:){0,6}([0-9a-fA-F]{1,4})?(:\d{1,5})?$|^([0-9a-fA-F]{1,4}:){1,7}:(:\d{1,5})?$/.test(
                        whitelist_ip[i],
                    )
                )
                    return res
                        .status(200)
                        .json({ error: `Invalid IP Address '${whitelist_ip[i]}'` })
            }
        }
        const db = await database()
        const apiTokenCollection = db.collection('apiToken')
        const apiToken = await apiTokenCollection.findOne({ user_id: req.user._id })

        if (!apiToken) return res.status(500).send()
        await apiTokenCollection.updateOne(
            { _id: new ObjectId(apiToken._id) },
            {
                $set: {
                    active: true,
                    whitelist_ip: whitelist_ip,
                    compromised: false,
                    updated_at: Date.now(),
                    modified_by: 'system',
                },
            },
        )

        activity(req, `added ${whitelist_ip} to whitelist ip`)
        return res.status(200).send()
    } catch (e) {
        logger.error(e)
    }
    res.status(500).send()
})

export default router
