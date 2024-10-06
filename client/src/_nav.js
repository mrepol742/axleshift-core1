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
        component: CNavGroup,
        name: 'Threat',
        icon: <FontAwesomeIcon icon={faShieldHalved} className="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'Threat Management',
                to: '/threat/management',
            },
            {
                component: CNavItem,
                name: 'Threat Detection',
                to: '/threat/detection',
            },
        ],
    },
    {
        component: CNavTitle,
        name: 'Payments',
    },
    {
        component: CNavItem,
        name: 'Payments Info',
        to: '/lorem',
        icon: <FontAwesomeIcon icon={faFileWord} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'History',
        to: '/lorem',
        icon: <FontAwesomeIcon icon={faFileWord} className="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Documents',
    },
    {
        component: CNavItem,
        name: 'Lorem ipsum',
        to: '/lorem',
        icon: <FontAwesomeIcon icon={faFileWord} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Lorem ipsum',
        to: '/lorem',
        icon: <FontAwesomeIcon icon={faFileWord} className="nav-icon" />,
    },
]

export default _nav
