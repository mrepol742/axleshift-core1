import React from 'react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faHouse,
    faLocationDot,
    faShip,
    faShieldHalved,
    faFileWord,
} from '@fortawesome/free-solid-svg-icons'

const _nav = [
    {
        component: CNavItem,
        name: 'Overview',
        to: '/',
        icon: <FontAwesomeIcon icon={faHouse} class="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Services',
    },
    {
        component: CNavGroup,
        name: 'Freight',
        icon: <FontAwesomeIcon icon={faShip} class="nav-icon" />,
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
        name: 'Tracking',
        to: '/tracking',
        icon: <FontAwesomeIcon icon={faLocationDot} class="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Security',
    },
    {
        component: CNavGroup,
        name: 'Threat',
        icon: <FontAwesomeIcon icon={faShieldHalved} class="nav-icon" />,
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
        name: 'Documents',
    },
    {
        component: CNavItem,
        name: 'Lorem ipsum',
        to: '/lorem',
        icon: <FontAwesomeIcon icon={faFileWord} class="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Lorem ipsum',
        to: '/lorem',
        icon: <FontAwesomeIcon icon={faFileWord} class="nav-icon" />,
    },
]

export default _nav
