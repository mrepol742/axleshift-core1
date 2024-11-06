import React, { lazy } from 'react'
import auth from './components/middleware/Auth'
import profile from './components/Profile'

const Overview = auth(lazy(() => import('./views/overview/index')))
const Info = auth(lazy(() => import('./views/overview/info')))

const Inbox = auth(lazy(() => import('./views/support/customer-service/index')))
const Chat = auth(lazy(() => import('./views/support/customer-service/chat')))
const Account = auth(lazy(() => import('./views/account/index')))

const Freight = auth(lazy(() => import('./views/freight/index')))
const FreightAir = auth(lazy(() => import('./views/freight/air')))
const FreightLand = auth(lazy(() => import('./views/freight/land')))
const FreightSea = auth(lazy(() => import('./views/freight/sea')))

const Pricing = auth(lazy(() => import('./views/pricing/index')))

const Security = auth(lazy(() => import('./views/security/index')))
const Management = auth(lazy(() => import('./views/security/management')))
const DeviceLock = auth(lazy(() => import('./views/security/device')))
const APIKey = auth(lazy(() => import('./views/security/api')))
const Activity = auth(lazy(() => import('./views/security/activity')))

const Track = auth(lazy(() => import('./views/track/index')))
const TrackInfo = auth(lazy(() => import('./views/track/info')))

const Err404 = auth(lazy(() => import('./views/errors/404')))
const Err500 = auth(lazy(() => import('./views/errors/500')))

const Logout = auth(lazy(() => import('./views/auth/logout')))

const routes = [
    { path: '/', name: 'Overview', element: Overview },
    { path: '/v/:id', name: 'Shipment Info', element: Info },

    { path: '/customer', name: 'Inbox', element: Inbox },
    { path: '/customer/:id', name: 'Chat', element: Chat },
    { path: '/account', name: 'Account', element: Account },

    { path: '/documents', name: 'Freight Documents', element: Err500 },

    { path: '/freight', name: 'Freight', element: Freight },
    { path: '/freight/air', name: 'Air', element: FreightAir },
    { path: '/freight/land', name: 'Land', element: FreightLand },
    { path: '/freight/sea', name: 'Sea', element: FreightSea },

    { path: '/payment', name: 'Payment Info', element: Err500 },
    { path: '/payment/invoice', name: 'Invoice', element: Err500 },

    { path: '/pricing', name: 'Pricing', element: Pricing },

    { path: '/security', name: 'Security', element: Security },
    { path: '/security/management', name: 'Security Management', element: Management },
    { path: '/security/activity', name: 'Security Activity', element: Activity },
    { path: '/security/device', name: 'Device Lock', element: DeviceLock },
    { path: '/security/apikey', name: 'API Key', element: APIKey },

    { path: '/track', name: 'Track', element: Track },
    { path: '/track/:id', name: 'Track', element: TrackInfo },

    { path: '/logout', name: 'Logout', element: Logout },

    { path: '*', name: '404', element: Err404 },
]

export default routes
