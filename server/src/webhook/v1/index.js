import express from 'express'
import Github from './github.js'
import Xendit from './xendit.js'

const router = express.Router()
router.use('/github', Github)
router.use('/xendit', Xendit)

export default router
