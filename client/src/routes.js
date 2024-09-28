import React from 'react'
import Auth from './components/middleware/Auth'

const views = {
    Overview: './views/overview/index',
    FreightInfo: './views/overview/info/index',

    Account: './views/account/index',
    AccountSecurity: './views/account/security/index',

    Freight: './views/freight/index',
    FreightAir: './views/freight/air/index',
    FreightLand: './views/freight/land/index',
    FreightSea: './views/freight/sea/index',

    Pricing: './views/pricing/index',

    Threat: './views/threat/index',
    ThreatDetection: './views/threat/threat-detection/index',
    ThreatManagement: './views/threat/threat-management/index',

    Track: './views/track/index',

    Err404: './views/errors/404',
}

const AuthLazy = (path) => Auth(React.lazy(() => /* @vite-ignore */ import(path)))

const components = Object.fromEntries(
    Object.entries(views).map(([key, path]) => [key, AuthLazy(path)]),
)

const routes = [
    { path: '/', name: 'Overview', element: components.Overview },
    { path: '/v/:id', name: 'Freight Info', element: components.FreightInfo },

    { path: '/account', name: 'Account', element: components.Account },
    { path: '/account/security', name: 'Security', element: components.AccountSecurity },

    { path: '/freight', name: 'Freight', element: components.Freight },
    { path: '/freight/air', name: 'Air', element: components.FreightAir },
    { path: '/freight/land', name: 'Land', element: components.FreightLand },
    { path: '/freight/sea', name: 'Sea', element: components.FreightSea },

    { path: '/pricing', name: 'Pricing', element: components.Pricing },

    { path: '/threat', name: 'Threat', element: components.Threat },
    { path: '/threat/detection', name: 'Detection', element: components.ThreatDetection },
    { path: '/threat/management', name: 'Management', element: components.ThreatManagement },

    { path: '/track', name: 'Track', element: components.Track },

    { path: '*', name: '404', element: components.Err404 },
]

export default routes
