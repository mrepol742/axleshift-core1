import React from 'react'

const Overview = React.lazy(() => import('./views/overview/index'))

const Freight = React.lazy(() => import('./views/freight/index'))
const FreightAir = React.lazy(() => import('./views/freight/air/index'))
const FreightLand = React.lazy(() => import('./views/freight/land/index'))
const FreightSea = React.lazy(() => import('./views/freight/sea/index'))

const Threat = React.lazy(() => import('./views/threat/index'))
const ThreatDetection = React.lazy(() => import('./views/threat/threat-detection/index'))
const ThreatManagement = React.lazy(() => import('./views/threat/threat-management/index'))

const Tracking = React.lazy(() => import('./views/tracking/index'))

const Page404 = React.lazy(() => import('./views/pages/404'))

const routes = [
    { path: '/', name: 'Overview', element: Overview },

    { path: '/freight', name: 'Freight', element: Freight },
    { path: '/freight/air', name: 'Air', element: FreightAir },
    { path: '/freight/land', name: 'Land', element: FreightLand },
    { path: '/freight/sea', name: 'Sea', element: FreightSea },

    { path: '/threat', name: 'Threat', element: Threat },
    { path: '/threat/detection', name: 'Detection', element: ThreatDetection },
    { path: '/threat/management', name: 'Management', element: ThreatManagement },

    { path: '/tracking', name: 'Tracking', element: Tracking },

    { path: '*', name: '404', element: Page404 },
]

export default routes
