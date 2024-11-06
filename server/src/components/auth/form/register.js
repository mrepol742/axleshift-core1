import crypto from 'crypto'
import database from '../../../models/mongodb.js'
import logger from '../../logger.js'
import passwordHash, { generateUniqueId } from '../../password.js'
import { addSession } from '../../../components/sessions.js'

const FormRegister = async (req, res) => {
    try {
        const { email, first_name, last_name, password, newsletter } = req.body
        const db = await database()
        const usersCollection = db.collection('users')
        const existingUser = await usersCollection.findOne({
            $or: [
                { [`oauth2.google.email`]: email },
                { [`oauth2.github.email`]: email },
                { email: email },
            ],
        })

        if (existingUser)
            return res.status(200).json({
                error: 'Email address already registered',
            })

        await usersCollection.insertOne({
            email: email,
            first_name: first_name,
            last_name: last_name,
            role: 'user',
            registration_type: 'form',
            avatar: null,
            password: passwordHash(password),
            email_verify_at: '',
            ref: generateUniqueId(),
            created_at: Date.now(),
            updated_at: Date.now(),
        })

        if (newsletter === 'true') {
            const newsletterCollection = db.collection('newsletter')
            const existingSubscriber = await newsletterCollection.findOne({ email: email })
            if (!existingSubscriber) {
                newsletterCollection.insertOne({
                    email: email,
                    is_subsribe: true,
                    created_at: Date.now(),
                    updated_at: Date.now(),
                })
            }
        }

        return res.status(201).json({ type: 'form' })
    } catch (err) {
        logger.error(err)
    }
    return res.status(500).send()
}

export default FormRegister
