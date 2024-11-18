import React, { lazy } from 'react'
import auth from './components/middleware/Auth'
import profile from './components/Profile'

const Logout = auth(lazy(() => import('./views/auth/Logout')))

const Overview = auth(lazy(() => import('./views/overview/index')))
const Info = auth(lazy(() => import('./views/overview/Info')))
const Search = auth(lazy(() => import('./views/overview/Search')))
const Schedules = auth(lazy(() => import('./views/schedules/index')))

const Inbox = auth(lazy(() => import('./views/support/customer-service/index')))
const Chat = auth(lazy(() => import('./views/support/customer-service/Chat')))
const Account = auth(lazy(() => import('./views/account/index')))

const Freight = auth(lazy(() => import('./views/freight/index')))
const FreightAir = auth(lazy(() => import('./views/freight/Air')))
const FreightLand = auth(lazy(() => import('./views/freight/Land')))
const FreightSea = auth(lazy(() => import('./views/freight/Sea')))

const Pricing = auth(lazy(() => import('./views/pricing/index')))

const Security = auth(lazy(() => import('./views/security/index')))
const Management = auth(lazy(() => import('./views/security/Management')))
const DeviceLock = auth(lazy(() => import('./views/security/Device')))
const APIKey = auth(lazy(() => import('./views/security/API')))
const Activity = auth(lazy(() => import('./views/security/Activity')))

const Track = auth(lazy(() => import('./views/track/index')))
const TrackInfo = auth(lazy(() => import('./views/track/Info')))

const Err404 = auth(lazy(() => import('./views/errors/404')))
const Err500 = auth(lazy(() => import('./views/errors/500')))

const routes = [
    { path: '/', name: 'Overview', element: Overview },
    { path: '/v/:id', name: 'Shipment Info', element: Info },
    { path: '/search', name: 'Search Shipment', element: Search },
    { path: '/schedules', name: 'Schedules', element: Schedules },

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
