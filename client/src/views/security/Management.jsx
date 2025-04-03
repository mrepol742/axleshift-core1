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
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChartLine,
    faTowerBroadcast,
    faBug,
    faKey,
    faList,
    faPersonDigging,
    faGlobe,
} from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
    Activity,
    Dependabot,
    Maintenance,
    Sentry,
    Sessions,
    IPFiltering,
    GEO,
} from './panel/index'

const SecurityManagement = () => {
    const [activeItemKey, setActiveItemKey] = useState(0)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const tab = window.location.hash ? window.location.hash.substring(1) : ''

    const handleTabChange = (itemKey, tabName) => {
        setActiveItemKey(itemKey)
        navigate(`#${tabName}`)
    }

    useEffect(() => {
        if (!tab && tab.length == 0) handleTabChange(0, 'dashboard')
        switch (tab) {
            case 'sessions':
                setActiveItemKey(0)
                break
            case 'dependabot':
                setActiveItemKey(1)
                break
            case 'sentry':
                setActiveItemKey(2)
                break
            case 'activity':
                setActiveItemKey(3)
                break
            case 'maintenance':
                setActiveItemKey(4)
                break
            case 'ip-filtering':
                setActiveItemKey(5)
                break
            case 'geo':
                setActiveItemKey(6)
                break
        }
        setLoading(false)
    }, [tab])

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    return (
        <div>
            <CNavbarNav className="mb-4">
                <div className="d-flex overflow-auto">
                    <CNavItem>
                        <CNavLink
                            className={`${activeItemKey === 0 ? 'active' : ''} text-nowrap me-3`}
                            onClick={() => handleTabChange(0, 'sessions')}
                        >
                            <FontAwesomeIcon icon={faTowerBroadcast} className="me-1" /> Sessions
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            className={`${activeItemKey === 1 ? 'active' : ''} text-nowrap me-3`}
                            onClick={() => handleTabChange(1, 'dependabot')}
                        >
                            <FontAwesomeIcon icon={faGithub} className="me-1" /> Dependabot
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            className={`${activeItemKey === 2 ? 'active' : ''} text-nowrap me-3`}
                            onClick={() => handleTabChange(2, 'sentry')}
                        >
                            <FontAwesomeIcon icon={faBug} className="me-1" /> Sentry
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            className={`${activeItemKey === 3 ? 'active' : ''} text-nowrap me-3`}
                            onClick={() => handleTabChange(3, 'activity')}
                        >
                            <FontAwesomeIcon icon={faList} className="me-1" /> Activity
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            className={`${activeItemKey === 4 ? 'active' : ''} text-nowrap me-3`}
                            onClick={() => handleTabChange(4, 'maintenance')}
                        >
                            <FontAwesomeIcon icon={faPersonDigging} className="me-1" /> Maintenance
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            className={`${activeItemKey === 5 ? 'active' : ''} text-nowrap me-3`}
                            onClick={() => handleTabChange(5, 'ip-filtering')}
                        >
                            <FontAwesomeIcon icon={faGlobe} className="me-1" /> IP Filtering
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            className={`${activeItemKey === 6 ? 'active' : ''} text-nowrap me-3`}
                            onClick={() => handleTabChange(6, 'geo')}
                        >
                            <FontAwesomeIcon icon={faGlobe} className="me-1" /> Geo
                        </CNavLink>
                    </CNavItem>
                </div>
                <div className="tab-content mt-4">
                    {activeItemKey === 0 && <Sessions />}
                    {activeItemKey === 1 && <Dependabot />}
                    {activeItemKey === 2 && <Sentry />}
                    {activeItemKey === 3 && <Activity />}
                    {activeItemKey === 4 && <Maintenance />}
                    {activeItemKey === 5 && <IPFiltering />}
                    {activeItemKey === 6 && <GEO />}
                </div>
            </CNavbarNav>
        </div>
    )
}

export default SecurityManagement
