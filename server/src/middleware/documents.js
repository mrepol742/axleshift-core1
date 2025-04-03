import axios from 'axios'
import { ObjectId } from 'mongodb'
import logger from '../utils/logger.js'
import database from '../models/mongodb.js'

const Documents = async (req, res, next) => {
    const id = req.params.id ? req.params.id : req.body.id
    if (!id) return res.status(400).json({ error: 'Invalid request' })

    try {
        const db = await database()

        const documentsCollection = db.collection('documents')

        const documents = await documentsCollection.findOne({
            $or: [{ freight_id: id }, { freight_tracking_number: id }],
        })
        if (!documents) return res.status(404).json({ error: 'Documents not found', id: id })

        req.documents = documents
        return next()
    } catch (err) {
        logger.error(err)
    }
    res.status(400).json({ error: 'Invalid request' })
}

export default Documents
