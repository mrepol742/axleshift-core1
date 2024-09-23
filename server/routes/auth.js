import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bcryptjs from 'bcryptjs'
import connectToDatabase from '../models/db.js'
import logger from '../logger.js'
import crypto from 'crypto'
import fs from 'fs'
import cron from 'node-cron'

const router = express.Router()
let sessions
init()

cron.schedule('0 * * * *', () => {
    fs.writeFile('./sessions/sessions.json', JSON.stringify(sessions), (err) => {
        if (err) throw err
        logger.info('Sessions save')
    })
})

/*
router.post('/register', async (req, res) => {
    try {
        const email = req.body.email
        const db = await connectToDatabase()
        const collection = db.collection('users')
        const existingEmail = await collection.findOne({ email: req.body.email })

        if (existingEmail) {
            logger.error('Email id already exists')
            return res.status(400).json({ error: 'Email id already exists' })
        }
        const hash = await bcryptjs.hash(element.password, process.env.BCRYPT_SECRET);
        await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            emailVerifiedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        res.json({ register: true })
    } catch (e) {
        logger.error(e)
        return res.status(500).send('Internal server error')
    }
})
*/

/*
  Url: /api/auth/login
  Params:
     email
     password
     recaptchaRef
*/
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        //TODO validate recaptcha ref!
        const recaptchaRef = req.body.recaptchaRef

        if (!email && !password && !recaptchaRef) return res.json({'status': 401})

        const db = await connectToDatabase()
        const collection = db.collection('users')
        const theUser = await collection.findOne({ email: email })

        if (!theUser) res.json({'status':404})
 
        const hash = await bcryptjs.hash(password, process.env.BCRYPT_SECRET);

        if (hash != theUser.password) res.json({'status':401})
        if (!sessions[theUser.email]) sessions[theUser.email] = {}
        if (!sessions[theUser.email]['profile']) sessions[theUser.email]['profile'] = theUser

        const session_token = crypto.createHash('sha256').update(theUser._id + Date.now()).digest('hex')
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        sessions[theUser.email][session_token] = {
            active: true,
            ip_address: ip,
            user_agent: req.headers['user-agent'],
            last_accessed: Date.now()
        }

        logger.info(JSON.stringify(sessions))

        res.json({'status':200, 'token': session_token})
        // finally the end :(
    } catch (e) {
        logger.error(e)
        res.json({'status':500})
    }
})

/*
  Url: /api/auth/verify
  Params:
     token
*/
router.post('/verify', function (req, res, next) {
    const token = req.body.token

    if (!token && !/^[0-9a-f]{64}$/.test(token)) return res.json({'status': 401})

    const email = Object.keys(sessions).find(email => 
        sessions[email][token]
    );

    if (email) {
        const sessionEntry = sessions[email][token]
        if (sessionEntry) return res.json({'status': 200, 'user': sessions[email].profile})
    }
    
    res.json({'status': 401})
});

/*
  Url: /api/auth/logout
  Params:
     token
*/
router.post('/logout', function (req, res, next) {
    const token = req.body.token

    if (!token && !/^[0-9a-f]{64}$/.test(token)) return res.json({'status': 401})
    
    const email = Object.keys(sessions).find(email => 
        sessions[email][token]
    );

    logger.info(token)
    logger.info(email)
    
    if (email) {
        const sessionEntry = sessions[email][token]
        if (sessionEntry) {
            sessionEntry.active = false
            return res.json({'status': 200})
        }
    }
    
    res.json({'status': 401})
});


function init() {
    fs.mkdir('./sessions', { recursive: true }, (err) => {
        if (err) throw err
    })

    try {
        sessions = JSON.parse(fs.readFileSync('./sessions/sessions.json', 'utf8'))
        logger.info('Sessions retrieved')
    } catch (err) {
        if (err.code === 'ENOENT') {
            sessions = {}
            logger.info('New session created')
        } else {
          throw err
        }
    }
}
  

export default router
