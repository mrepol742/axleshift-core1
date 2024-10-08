import React, { lazy } from 'react'
import withAuth from './components/middleware/Auth'

const Overview = withAuth(lazy(() => import('./views/overview/index')))
const FreightInfo = withAuth(lazy(() => import('./views/overview/info/index')))

const Account = withAuth(lazy(() => import('./views/account/index')))
const AccountSecurity = withAuth(lazy(() => import('./views/account/security/index')))

const Freight = withAuth(lazy(() => import('./views/freight/index')))
const FreightAir = withAuth(lazy(() => import('./views/freight/air/index')))
const FreightLand = withAuth(lazy(() => import('./views/freight/land/index')))
const FreightSea = withAuth(lazy(() => import('./views/freight/sea/index')))

const Pricing = withAuth(lazy(() => import('./views/pricing/index')))

const Threat = withAuth(lazy(() => import('./views/threat/index')))
const ThreatDetection = withAuth(lazy(() => import('./views/threat/threat-detection/index')))
const ThreatManagement = withAuth(lazy(() => import('./views/threat/threat-management/index')))

const Track = withAuth(lazy(() => import('./views/track/index')))
const TrackInfo = withAuth(lazy(() => import('./views/track/info/index')))

const Err404 = withAuth(lazy(() => import('./views/errors/404')))

const routes = [
    { path: '/', name: 'Overview', element: Overview },
    { path: '/v/:id', name: 'Freight Info', element: FreightInfo },

    { path: '/account', name: 'Account', element: Account },
    { path: '/account/security', name: 'Security', element: AccountSecurity },

    { path: '/freight', name: 'Freight', element: Freight },
    { path: '/freight/air', name: 'Air', element: FreightAir },
    { path: '/freight/land', name: 'Land', element: FreightLand },
    { path: '/freight/sea', name: 'Sea', element: FreightSea },

    { path: '/pricing', name: 'Pricing', element: Pricing },

    { path: '/threat', name: 'Threat', element: Threat },
    { path: '/threat/detection', name: 'Detection', element: ThreatDetection },
    { path: '/threat/management', name: 'Management', element: ThreatManagement },

    { path: '/track', name: 'Track', element: Track },
    { path: '/track/:id', name: 'Track', element: TrackInfo },

    { path: '*', name: '404', element: Err404 },
]

export default routes
