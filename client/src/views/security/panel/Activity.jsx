import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CTabs,
    CTabList,
    CTab,
    CTabContent,
    CTabPanel,
    CSpinner,
    CNavItem,
    CNavLink,
    CNavbarNav,
    CButton,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChartLine,
    faTowerBroadcast,
    faBug,
    faKey,
    faList,
    faPersonDigging,
    faUser,
    faGlobe,
} from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import Activity from './log-management/Activity'
import Servers from './log-management/Servers'

const LogManagement = () => {
    const [activeItemKey, setActiveItemKey] = useState(0)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleTabChange = (itemKey, tabName) => {
        setActiveItemKey(itemKey)
    }

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    return (
        <div>
            <CButton
                className={`${activeItemKey === 0 ? 'text-primary' : ''} text-nowrap me-1`}
                onClick={() => handleTabChange(0, 'users')}
            >
                <FontAwesomeIcon icon={faUser} className="me-1" /> Servers
            </CButton>
            <CButton
                className={`${activeItemKey === 1 ? 'text-primary' : ''} text-nowrap me-1`}
                onClick={() => handleTabChange(1, 'sessions')}
            >
                <FontAwesomeIcon icon={faTowerBroadcast} className="me-1" /> Accounts
            </CButton>
            <div className="tab-content mt-2">
                {activeItemKey === 0 && <Servers />}
                {activeItemKey === 1 && <Activity />}
            </div>
        </div>
    )
}

export default LogManagement
