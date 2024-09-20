import React from 'react'

const Overview = React.lazy(() => import('./views/overview/index'))

const Account = React.lazy(() => import('./views/account/index'))
const AccountSecurity = React.lazy(() => import('./views/account/security/index'))

const Freight = React.lazy(() => import('./views/freight/index'))
const FreightAir = React.lazy(() => import('./views/freight/air/index'))
const FreightLand = React.lazy(() => import('./views/freight/land/index'))
const FreightSea = React.lazy(() => import('./views/freight/sea/index'))

const Threat = React.lazy(() => import('./views/threat/index'))
const ThreatDetection = React.lazy(() => import('./views/threat/threat-detection/index'))
const ThreatManagement = React.lazy(() => import('./views/threat/threat-management/index'))

const Tracking = React.lazy(() => import('./views/tracking/index'))

const Err404 = React.lazy(() => import('./views/errors/404'))

const routes = [
    { path: '/', name: 'Overview', element: Overview },

    { path: '/account', name: 'Account', element: Account },
    { path: '/account/security', name: 'Security', element: AccountSecurity },

    { path: '/freight', name: 'Freight', element: Freight },
    { path: '/freight/air', name: 'Air', element: FreightAir },
    { path: '/freight/land', name: 'Land', element: FreightLand },
    { path: '/freight/sea', name: 'Sea', element: FreightSea },

    { path: '/threat', name: 'Threat', element: Threat },
    { path: '/threat/detection', name: 'Detection', element: ThreatDetection },
    { path: '/threat/management', name: 'Management', element: ThreatManagement },

    { path: '/track', name: 'Tracking', element: Tracking },

    { path: '*', name: '404', element: Err404 },
]

export default routes
