import React, { lazy } from 'react'
import withAuth from './components/middleware/Auth'

const Overview = withAuth(lazy(() => import('./views/overview/index')))
const FreightInfo = withAuth(lazy(() => import('./views/overview/info')))

const Account = withAuth(lazy(() => import('./views/account/index')))

const Freight = withAuth(lazy(() => import('./views/freight/index')))
const FreightAir = withAuth(lazy(() => import('./views/freight/air')))
const FreightLand = withAuth(lazy(() => import('./views/freight/land')))
const FreightSea = withAuth(lazy(() => import('./views/freight/sea')))

const Pricing = withAuth(lazy(() => import('./views/pricing/index')))

const SecurityManagement = withAuth(lazy(() => import('./views/security/index')))
const SecurityAnalysis = withAuth(lazy(() => import('./views/security/analysis')))
const DeviceLock = withAuth(lazy(() => import('./views/security/device')))

const Track = withAuth(lazy(() => import('./views/track/index')))
const TrackInfo = withAuth(lazy(() => import('./views/track/info')))

const Err404 = withAuth(lazy(() => import('./views/errors/404')))
const Err500 = withAuth(lazy(() => import('./views/errors/500')))

const routes = [
    { path: '/', name: 'Overview', element: Overview },
    { path: '/v/:id', name: 'Freight Info', element: FreightInfo },

    { path: '/account', name: 'Account', element: Account },

    { path: '/documents', name: 'Freight Documents', element: Err500 },

    { path: '/freight', name: 'Freight', element: Freight },
    { path: '/freight/air', name: 'Air', element: FreightAir },
    { path: '/freight/land', name: 'Land', element: FreightLand },
    { path: '/freight/sea', name: 'Sea', element: FreightSea },

    { path: '/payment', name: 'Payment History', element: Err500 },
    { path: '/payment/info', name: 'Payment Info', element: Err500 },

    { path: '/pricing', name: 'Pricing', element: Pricing },

    { path: '/security', name: 'Security Management', element: SecurityManagement },
    { path: '/security/analysis', name: 'Security Analysis', element: SecurityAnalysis },
    { path: '/security/device', name: 'Device Lock', element: DeviceLock },

    { path: '/track', name: 'Track', element: Track },
    { path: '/track/:id', name: 'Track', element: TrackInfo },

    { path: '*', name: '404', element: Err404 },
]

export default routes
