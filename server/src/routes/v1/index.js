import express from 'express'
import auth from './auth.js'
import authToken from './auth/token.js'
import authVerify from './auth/verify.js'
import freight from './freight.js'
import track from './track.js'
import schedules from './schedules.js'
import securityManagement from './security/management.js'
import securityActivity from './security/activity.js'
import securitySessions from './security/sessions.js'
import prometheus from './metrics/prometheus.js'
import insights from './insights.js'
import newsletter from './newsletter.js'
import invoices from './invoices.js'

const router = express.Router()
router.use('/auth', auth)
router.use('/auth/token', authToken)
router.use('/auth/verify', authVerify)

router.use('/freight', freight)
router.use('/track', track)
router.use('/schedules', schedules)

router.use('/sec/management', securityManagement)
router.use('/sec/activity', securityActivity)
router.use('/sec/sessions', securitySessions)

router.use('/metrics', prometheus)

router.use('/insights', insights)
router.use('/newsletter', newsletter)

router.use('/invoices', invoices)

export default router
