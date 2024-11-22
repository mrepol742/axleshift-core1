import React from 'react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChartLine,
    faLocationDot,
    faShip,
    faShieldHalved,
    faFileWord,
    faPesoSign,
    faBarsProgress,
    faCircleNotch,
    faLock,
    faFileInvoice,
    faCircleInfo,
    faFile,
    faHeadset,
    faServer,
    faCircleQuestion,
    faKey,
    faRectangleList,
    faTowerBroadcast,
} from '@fortawesome/free-solid-svg-icons'

const _nav = [
    {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <FontAwesomeIcon icon={faChartLine} className="nav-icon" />,
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
        to: '/security/management',
        icon: <FontAwesomeIcon icon={faBarsProgress} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Activity',
        to: '/security/activity',
        icon: <FontAwesomeIcon icon={faRectangleList} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Access Token',
        to: '/security/access-token',
        icon: <FontAwesomeIcon icon={faKey} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Sessions',
        to: '/security/sessions',
        icon: <FontAwesomeIcon icon={faTowerBroadcast} className="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Payments',
    },
    {
        component: CNavItem,
        name: 'Payment Info',
        to: '/payment/',
        icon: <FontAwesomeIcon icon={faCircleInfo} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Invoice',
        to: '/payment/invoice',
        icon: <FontAwesomeIcon icon={faFileInvoice} className="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Documents',
    },
    {
        component: CNavItem,
        name: 'Freight Documents',
        to: '/documents',
        icon: <FontAwesomeIcon icon={faFile} className="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Support',
    },
    {
        component: CNavItem,
        name: 'Customer Service',
        to: '/customer',
        icon: <FontAwesomeIcon icon={faHeadset} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'FAQ',
        to: '/faq',
        icon: <FontAwesomeIcon icon={faCircleQuestion} className="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Policies',
    },
    {
        component: CNavItem,
        name: 'Terms of Service',
        to: '/terms-of-service',
        icon: <FontAwesomeIcon icon={faFile} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Privacy Policy',
        to: '/privacy-policy',
        icon: <FontAwesomeIcon icon={faFile} className="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'System',
    },
    {
        component: CNavItem,
        name: 'Network Status',
        to: 'https://stats.uptimerobot.com/5l58Mua0Wi',
        icon: <FontAwesomeIcon icon={faServer} className="nav-icon" />,
    },
]

export default _nav
