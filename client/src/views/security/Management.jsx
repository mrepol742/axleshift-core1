import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CTabs, CTabList, CTab, CTabContent, CTabPanel, CSpinner } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChartLine,
    faTowerBroadcast,
    faBug,
    faKey,
    faList,
    faPersonDigging,
} from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
    Activity,
    AccessToken,
    Dashboard,
    Dependabot,
    Maintenance,
    Sentry,
    Sessions,
} from './panel/index'

const SecurityManagement = () => {
    const [activeItemKey, setActiveItemKey] = useState(0)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const tab = window.location.hash ? window.location.hash.substring(1) : ''

    const handleTabChange = (itemKey, tabName) => {
        navigate(`#${tabName}`)
    }

    useEffect(() => {
        if (!tab && tab.length == 0) handleTabChange(0, 'dashboard')
        switch (tab) {
            case 'dashboard':
                setActiveItemKey(0)
                break
            case 'sessions':
                setActiveItemKey(1)
                break
            case 'dependabot':
                setActiveItemKey(2)
                break
            case 'sentry':
                setActiveItemKey(3)
                break
            case 'access-token':
                setActiveItemKey(4)
                break
            case 'activity':
                setActiveItemKey(5)
                break
            case 'maintenance':
                setActiveItemKey(6)
                break
        }
        setLoading(false)
    }, [])

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}

            {!loading && (
                <CTabs activeItemKey={activeItemKey} className="mb-4">
                    <CTabList variant="underline-border">
                        <CTab
                            aria-controls="dashboard-tab-pane"
                            itemKey={0}
                            onClick={() => handleTabChange(0, 'dashboard')}
                        >
                            <FontAwesomeIcon icon={faChartLine} className="me-1" /> Dashboard
                        </CTab>
                        <CTab
                            aria-controls="sessions-tab-pane"
                            itemKey={1}
                            onClick={() => handleTabChange(1, 'sessions')}
                        >
                            <FontAwesomeIcon icon={faTowerBroadcast} className="me-1" /> Sessions
                        </CTab>
                        <CTab
                            aria-controls="dependabot-tab-pane"
                            itemKey={2}
                            onClick={() => handleTabChange(2, 'dependabot')}
                        >
                            <FontAwesomeIcon icon={faGithub} className="me-1" /> Dependabot
                        </CTab>
                        <CTab
                            aria-controls="sentry-tab-pane"
                            itemKey={3}
                            onClick={() => handleTabChange(3, 'sentry')}
                        >
                            <FontAwesomeIcon icon={faBug} className="me-1" /> Sentry
                        </CTab>
                        <CTab
                            aria-controls="access-token-tab-pane"
                            itemKey={4}
                            onClick={() => handleTabChange(4, 'access-token')}
                        >
                            <FontAwesomeIcon icon={faKey} className="me-1" /> Access Token
                        </CTab>
                        <CTab
                            aria-controls="activity-tab-pane"
                            itemKey={5}
                            onClick={() => handleTabChange(5, 'activity')}
                        >
                            <FontAwesomeIcon icon={faList} className="me-1" /> Activity
                        </CTab>
                        <CTab
                            aria-controls="maintenance-tab-pane"
                            itemKey={6}
                            onClick={() => handleTabChange(6, 'maintenance')}
                        >
                            <FontAwesomeIcon icon={faPersonDigging} className="me-1" /> Maintenance
                        </CTab>
                    </CTabList>
                    <CTabContent>
                        <CTabPanel
                            className="py-3"
                            aria-labelledby="dashboard-tab-pane"
                            itemKey={0}
                        >
                            <Dashboard />
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="sessions-tab-pane" itemKey={1}>
                            <Sessions />
                        </CTabPanel>
                        <CTabPanel
                            className="py-3"
                            aria-labelledby="dependabot-tab-pane"
                            itemKey={2}
                        >
                            <Dependabot />
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="sentry-tab-pane" itemKey={3}>
                            <Sentry />
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="api-tab-pane" itemKey={4}>
                            <AccessToken />
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="api-tab-pane" itemKey={5}>
                            <Activity />
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="api-tab-pane" itemKey={6}>
                            <Maintenance />
                        </CTabPanel>
                    </CTabContent>
                </CTabs>
            )}
        </div>
    )
}

export default SecurityManagement
