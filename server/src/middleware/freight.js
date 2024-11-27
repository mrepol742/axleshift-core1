import axios from 'axios'
import { ObjectId } from 'mongodb'
import logger from '../utils/logger.js'
import database from '../models/mongodb.js'

const freight = async (req, res, next) => {
    const id = req.params.id
        ? /[a-fA-F0-9]{24}/.test(req.params.id)
            ? req.params.id
            : req.body.id
        : req.body.id
    if (!id) return res.status(400).send()

    try {
        const db = await database()

        const freightCollection = db.collection('freight')

        const _freight = await freightCollection.findOne({ _id: new ObjectId(id) })
        if (!_freight) return res.status(404).send()

        req.freight = _freight
        return next()
    } catch (err) {
        logger.error(err)
    }
    res.status(400).send()
}

export default freight
