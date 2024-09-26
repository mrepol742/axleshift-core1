import React from 'react'
import Auth from './components/middleware/Auth'

const Overview = Auth(React.lazy(() => import('./views/overview/index')))
const FreightInfo = Auth(React.lazy(() => import('./views/overview/info/index')))

const Account = Auth(React.lazy(() => import('./views/account/index')))
const AccountSecurity = Auth(React.lazy(() => import('./views/account/security/index')))

const Freight = Auth(React.lazy(() => import('./views/freight/index')))
const FreightAir = Auth(React.lazy(() => import('./views/freight/air/index')))
const FreightLand = Auth(React.lazy(() => import('./views/freight/land/index')))
const FreightSea = Auth(React.lazy(() => import('./views/freight/sea/index')))

const Pricing = Auth(React.lazy(() => import('./views/pricing/index')))

const Threat = Auth(React.lazy(() => import('./views/threat/index')))
const ThreatDetection = Auth(React.lazy(() => import('./views/threat/threat-detection/index')))
const ThreatManagement = Auth(React.lazy(() => import('./views/threat/threat-management/index')))

const Track = Auth(React.lazy(() => import('./views/track/index')))

const Err404 = Auth(React.lazy(() => import('./views/errors/404')))

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

    { path: '*', name: '404', element: Err404 },
]

export default routes
