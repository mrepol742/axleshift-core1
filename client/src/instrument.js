import React, { useEffect } from 'react'
import * as Sentry from '@sentry/react'
import {
    createRoutesFromChildren,
    matchRoutes,
    useNavigation,
    useNavigationType,
} from 'react-router-dom'
import { VITE_APP_SENTRY_DNS } from './config'

Sentry.init({
    dsn: VITE_APP_SENTRY_DNS,
    integrations: [
        // See docs for support of different versions of variation of react router
        // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
        Sentry.reactRouterV6BrowserTracingIntegration({
            useEffect,
            useNavigation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes,
        }),
        Sentry.replayIntegration(),
    ],

    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
})
