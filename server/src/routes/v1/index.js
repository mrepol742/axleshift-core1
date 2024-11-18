import express from 'express'
import auth from './auth.js'
import freight from './freight.js'
import track from './track.js'
import schedules from './schedules.js'
import securityManagement from './security/management.js'
import securityActivity from './security/activity.js'
import insights from './insights.js'
import newsletter from './newsletter.js'
import metrics from './metrics.js'
import { NODE_ENV } from '../../config.js'

const router = express.Router()
router.use('/auth', auth)
router.use('/freight', freight)
router.use('/track', track)
router.use('/schedules', schedules)
router.use('/sec/management', securityManagement)
router.use('/sec/activity', securityActivity)
router.use('/insights', insights)
router.use('/newsletter', newsletter)
// there are no ways to protect this route as
// prometheus does not have anything to deal with security in the first place
// since we dont have admin access to solve this
// ill leave this to work only on localhost!
if (NODE_ENV === 'production') router.use('/metrics', metrics)

export default router
