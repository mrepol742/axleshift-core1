import express from 'express'
import auth from './auth.js'
import authToken from './auth/token.js'
import authVerify from './auth/verify.js'
import authForgotPassword from './auth/forgotPassword.js'
import freight from './freight.js'
import track from './track.js'
import securityManagement from './security/management.js'
import securityActivity from './security/activity.js'
import securitySessions from './security/sessions.js'
import prometheus from './metrics/prometheus.js'
import insights from './insights.js'
import newsletter from './newsletter.js'
import invoices from './invoices.js'
import notifications from './notifications.js'
import addresses from './addresses.js'
import document from './freight/documents.js'
import mail from './mail.js'
import mongodb from './metrics/mongodb.js'
import redis from './metrics/redis.js'
import insightsModal from './insights/modal.js'
import webhooks from './security/webhooks.js'

const router = express.Router()
router.use('/auth', auth)
router.use('/auth/token', authToken)
router.use('/auth/verify', authVerify)
router.use('/auth/forgot-password', authForgotPassword)

router.use('/freight', freight)
router.use('/documents', document)
router.use('/track', track)

// **** ADMIN & SUPER ADMIN
router.use('/sec/management', securityManagement)
router.use('/sec/webhooks', webhooks)
// ****
router.use('/sec/activity', securityActivity)
router.use('/sec/sessions', securitySessions)

// **** ADMIN & SUPER ADMIN
router.use('/metrics/prometheus', prometheus)
router.use('/metrics/mongodb', mongodb)
router.use('/metrics/redis', redis)
// ****

router.use('/notifications', notifications)

router.use('/insights', insights)
router.use('/insights/modal', insightsModal)

router.use('/newsletter', newsletter)

router.use('/invoices', invoices)
router.use('/addresses', addresses)

router.use('/mail', mail)

export default router
