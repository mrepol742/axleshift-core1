import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bcryptjs from 'bcryptjs'
import connectToDatabase from '../models/db.js'
import logger from '../logger.js'

const router = express.Router()

router.get('/', async (req, res) => {
});

router.post('/add', async (req, res) => {
});


export default router
