import React from 'react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faHouse,
    faLocationDot,
    faShip,
    faShieldHalved,
    faFileWord,
    faPesoSign,
} from '@fortawesome/free-solid-svg-icons'

const _nav = [
    {
        component: CNavItem,
        name: 'Overview',
        to: '/',
        icon: <FontAwesomeIcon icon={faHouse} className="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Services',
    },
    {
        component: CNavGroup,
        name: 'Freight',
        icon: <FontAwesomeIcon icon={faShip} className="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'Sea Freight',
                to: '/freight/sea',
            },
            {
                component: CNavItem,
                name: 'Air Freight',
                to: '/freight/air',
            },
            {
                component: CNavItem,
                name: 'Land Freight',
                to: '/freight/land',
            },
        ],
    },
    {
        component: CNavItem,
        name: 'Track',
        to: '/track',
        icon: <FontAwesomeIcon icon={faLocationDot} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Pricing',
        to: '/pricing',
        icon: <FontAwesomeIcon icon={faPesoSign} className="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Security',
    },
    {
        component: CNavItem,
        name: 'Management',
        to: '/security',
        icon: <FontAwesomeIcon icon={faShieldHalved} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Analysis',
        to: '/security/analysis',
        icon: <FontAwesomeIcon icon={faShieldHalved} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Device Lock',
        to: '/security/device',
        icon: <FontAwesomeIcon icon={faShieldHalved} className="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Payments',
    },
    {
        component: CNavItem,
        name: 'Payment Info',
        to: '/payment/info',
        icon: <FontAwesomeIcon icon={faFileWord} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'History',
        to: '/payment',
        icon: <FontAwesomeIcon icon={faFileWord} className="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Documents',
    },
    {
        component: CNavItem,
        name: 'Freight Documents',
        to: '/documents',
        icon: <FontAwesomeIcon icon={faFileWord} className="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Support',
    },
    {
        component: CNavItem,
        name: 'Customer Service',
        to: '/customer',
        icon: <FontAwesomeIcon icon={faFileWord} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'FAQ',
        to: '/faq',
        icon: <FontAwesomeIcon icon={faFileWord} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Network Status',
        to: 'https://stats.uptimerobot.com/5l58Mua0Wi',
        icon: <FontAwesomeIcon icon={faFileWord} className="nav-icon" />,
    },
]

export default _nav
