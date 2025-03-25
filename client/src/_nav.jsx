import React from 'react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChartLine,
    faLocationDot,
    faShip,
    faPercent,
    faBarsProgress,
    faFileInvoice,
    faFile,
    faHeadset,
    faServer,
    faCircleQuestion,
    faKey,
    faRectangleList,
    faTowerBroadcast,
    faPlus,
    faGlobe,
} from '@fortawesome/free-solid-svg-icons'

const _nav = [
    {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        role_exclude: [],
        icon: <FontAwesomeIcon icon={faChartLine} className="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Services',
        role_exclude: [],
    },
    {
        component: CNavItem,
        name: 'Book Now',
        to: '/book-now',
        role_exclude: ['staff', 'admin'],
        icon: <FontAwesomeIcon icon={faPlus} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Track',
        to: '/track',
        role_exclude: [],
        icon: <FontAwesomeIcon icon={faLocationDot} className="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Security',
        role_exclude: ['staff'],
    },
    {
        component: CNavItem,
        name: 'Management',
        to: '/security/management',
        role_exclude: ['user', 'staff'],
        icon: <FontAwesomeIcon icon={faBarsProgress} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Account Logs',
        to: '/security/account-logs',
        role_exclude: ['staff'],
        icon: <FontAwesomeIcon icon={faRectangleList} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Access Token',
        to: '/security/access-token',
        role_exclude: ['staff', 'user'],
        icon: <FontAwesomeIcon icon={faKey} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Webhooks',
        to: '/security/webhooks',
        role_exclude: ['staff', 'user'],
        icon: <FontAwesomeIcon icon={faGlobe} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Sessions',
        to: '/security/sessions',
        role_exclude: [],
        icon: <FontAwesomeIcon icon={faTowerBroadcast} className="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Payments',
        role_exclude: [],
    },
    {
        component: CNavItem,
        name: 'Invoices',
        to: '/invoices',
        role_exclude: [],
        icon: <FontAwesomeIcon icon={faFileInvoice} className="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Support',
        role_exclude: [],
    },
    {
        component: CNavItem,
        name: 'Customer Service',
        to: '/customer',
        role_exclude: [],
        icon: <FontAwesomeIcon icon={faHeadset} className="nav-icon" />,
    },
]

export default _nav
