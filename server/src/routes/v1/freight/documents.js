import { ObjectId } from 'mongodb'
import express from 'express'
import crypto from 'crypto'
import database from '../../../models/mongodb.js'
import logger from '../../../utils/logger.js'
import auth from '../../../middleware/auth.js'
import recaptcha from '../../../middleware/recaptcha.js'
import activity from '../../../components/activity.js'
import redis, { getCache, setCache, remCache } from '../../../models/redis.js'

const router = express.Router()

export default router
