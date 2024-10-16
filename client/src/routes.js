import React, { lazy } from 'react'
import auth from './components/middleware/Auth'

const Overview = auth(lazy(() => import('./views/overview/index')))
const FreightInfo = auth(lazy(() => import('./views/overview/info')))

const Customer = auth(lazy(() => import('./views/customer/index')))
const Account = auth(lazy(() => import('./views/account/index')))

const Freight = auth(lazy(() => import('./views/freight/index')))
const FreightAir = auth(lazy(() => import('./views/freight/air')))
const FreightLand = auth(lazy(() => import('./views/freight/land')))
const FreightSea = auth(lazy(() => import('./views/freight/sea')))

const Pricing = auth(lazy(() => import('./views/pricing/index')))

const SecurityManagement = auth(lazy(() => import('./views/security/index')))
const SecurityAnalysis = auth(lazy(() => import('./views/security/analysis')))
const DeviceLock = auth(lazy(() => import('./views/security/device')))
const APIKey = auth(lazy(() => import('./views/security/api')))

const Track = auth(lazy(() => import('./views/track/index')))
const TrackInfo = auth(lazy(() => import('./views/track/info')))

const Err404 = auth(lazy(() => import('./views/errors/404')))
const Err500 = auth(lazy(() => import('./views/errors/500')))

const Logout = auth(lazy(() => import('./views/auth/logout')))

const routes = [
    { path: '/', name: 'Overview', element: Overview },
    { path: '/v/:id', name: 'Freight Info', element: FreightInfo },

    { path: '/customer', name: 'Customer Service', element: Customer },
    { path: '/account', name: 'Account', element: Account },

    { path: '/documents', name: 'Freight Documents', element: Err500 },

    { path: '/freight', name: 'Freight', element: Freight },
    { path: '/freight/air', name: 'Air', element: FreightAir },
    { path: '/freight/land', name: 'Land', element: FreightLand },
    { path: '/freight/sea', name: 'Sea', element: FreightSea },

    { path: '/payment', name: 'Payment History', element: Err500 },
    { path: '/payment/info', name: 'Payment Info', element: Err500 },

    { path: '/pricing', name: 'Pricing', element: Pricing },

    { path: '/security/management', name: 'Security Management', element: SecurityManagement },
    { path: '/security/analysis', name: 'Security Analysis', element: SecurityAnalysis },
    { path: '/security/device', name: 'Device Lock', element: DeviceLock },
    { path: '/security/apikey', name: 'API Key', element: APIKey },

    { path: '/track', name: 'Track', element: Track },
    { path: '/track/:id', name: 'Track', element: TrackInfo },

    { path: '/logout', name: 'Logout', element: Logout },

    { path: '*', name: '404', element: Err404 },
]

export default routes
