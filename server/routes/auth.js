import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bcryptjs from 'bcryptjs'
import connectToDatabase from '../models/db.js'
import logger from '../logger.js'
import crypto from 'crypto'

const router = express.Router()

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
*/
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase()
        const collection = db.collection('users')
        const theUser = await collection.findOne({ email: req.query.email })

        if (!theUser) res.json({'status':404})
 
        const hash = await bcryptjs.hash(req.query.password, process.env.BCRYPT_SECRET);

        if (hash != theUser.password) res.json({'status':401})
        if (!req.session.sessionIds) req.session.sessionIds = {};
        if (!req.session.sessionIds[theUser.email]) req.session.sessionIds[theUser.email] = {};
        if (!req.session.sessionIds[theUser.email]['profile']) req.session.sessionIds[theUser.email]['profile'] = theUser;

        const session_token = crypto.createHash('sha256').update(theUser._id + Date.now()).digest('hex');
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        req.session.sessionIds[theUser.email][session_token] = {
            active: true,
            ip_address: ip,
            user_agent: req.headers['user-agent'],
            last_accessed: Date.now()
        }

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
     session_token
*/
router.post('/verify', function (req, res, next) {
    const session_token = req.query.session_token;

    if (!session_token) return res.json({'status': 401});

    const email = Object.keys(req.session.sessionIds).find(email => 
        req.session.sessionIds[email][session_token]
    );

    if (email) {
        const sessionEntry = req.session.sessionIds[email][session_token];
        if (sessionEntry) return res.json({'status': 200, 'user': req.session.sessionIds[email].profile});
    }
    
    res.json({'status': 401});
});

/*
  Url: /api/auth/logout
  Params:
     session_token
*/
router.post('/logout', function (req, res, next) {
    const session_token = req.query.session_token;

    if (!session_token) return res.json({'status': 401});

    const email = Object.keys(req.session.sessionIds).find(email => 
        req.session.sessionIds[email][session_token]
    );

    if (email) {
        const sessionEntry = req.session.sessionIds[email][session_token];
        if (sessionEntry) {
            sessionEntry.active = false;
            return res.json({'status': 200});
        }
    }
    
    res.json({'status': 401});
});

  
  

export default router
