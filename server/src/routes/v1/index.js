import express from 'express'
import auth from './auth.js'
import freight from './freight.js'
import track from './track.js'
import threat from './threat.js'
import insights from './insights.js'
import newsletter from './newsletter.js'

const router = express.Router()
router.use('/auth', auth)
router.use('/freight', freight)
router.use('/track', track)
router.use('/threat', threat)
router.use('/insights', insights)
router.use('/newsletter', newsletter)

export default router
