import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CContainer,
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CForm,
    CFormSelect,
    CRow,
    CCol,
    CImage,
    CCard,
    CCardTitle,
    CButton,
    CCardHeader,
    CSpinner,
    CCardBody,
    CCardText,
    CCardFooter,
    CTable,
    CTableHead,
    CTableRow,
    CTableDataCell,
    CTableBody,
    CTableHeaderCell,
    CTabs,
    CTabList,
    CTab,
    CTabContent,
    CTabPanel,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { VITE_APP_API_URL, VITE_APP_SESSION } from '../../config'
import { Activity, Api, Dashboard, Dependabot, Maintenance, Sentry, Sessions } from './panel/index'

const SecurityManagement = () => {
    const [loading, setLoading] = useState(true)
    const [state, setState] = useState('2')
    const [priority, setPriority] = useState('1')
    const [order, setOrder] = useState('1')
    const [query, setQuery] = useState('')
    const [result, setResult] = useState({ scm: [], sessions: [], sentry: [], apiToken: {} })
    const navigate = useNavigate()

    const fetchData = async () => {
        await axios
            .get(`${VITE_APP_API_URL}/api/v1/threat/`, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => setResult(response.data))
            .catch((error) => {
                console.error(error)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}

            {!loading && (
                <CTabs activeItemKey={0} className="mb-4">
                    <CTabList variant="underline-border">
                        <CTab aria-controls="dashboard-tab-pane" itemKey={0}>
                            Dashboard
                        </CTab>
                        <CTab aria-controls="sessions-tab-pane" itemKey={1}>
                            Sessions
                        </CTab>
                        <CTab aria-controls="dependabot-tab-pane" itemKey={2}>
                            Dependabot
                        </CTab>
                        <CTab aria-controls="sentry-tab-pane" itemKey={3}>
                            Sentry
                        </CTab>
                        <CTab aria-controls="api-tab-pane" itemKey={4}>
                            API Key
                        </CTab>
                        <CTab aria-controls="activity-tab-pane" itemKey={5}>
                            Activity
                        </CTab>
                        <CTab aria-controls="maintenance-tab-pane" itemKey={6}>
                            Maintenance
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
                            <Sessions result={result} />
                        </CTabPanel>
                        <CTabPanel
                            className="py-3"
                            aria-labelledby="dependabot-tab-pane"
                            itemKey={2}
                        >
                            <Dependabot
                                query={query}
                                setQuery={setQuery}
                                state={state}
                                setState={setState}
                                priority={priority}
                                setPriority={setPriority}
                                order={order}
                                setOrder={setOrder}
                                result={result}
                            />
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="sentry-tab-pane" itemKey={3}>
                            <Sentry
                                query={query}
                                setQuery={setQuery}
                                state={state}
                                setState={setState}
                                priority={priority}
                                setPriority={setPriority}
                                order={order}
                                setOrder={setOrder}
                                result={result}
                            />
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="api-tab-pane" itemKey={4}>
                            <Api setLoading={setLoading} result={result} />
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="api-tab-pane" itemKey={5}>
                            <Activity setLoading={setLoading} result={result} />
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="api-tab-pane" itemKey={6}>
                            <Maintenance setLoading={setLoading} result={result} />
                        </CTabPanel>
                    </CTabContent>
                </CTabs>
            )}
        </div>
    )
}

export default SecurityManagement
