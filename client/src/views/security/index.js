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
import axios from 'axios'
import Cookies from 'js-cookie'

import Dependabot from './panel/dependabot'
import Sessions from './panel/sessions'
import OTP from './panel/otp'

const Security = () => {
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState('2')
    const [priority, setPriority] = useState('1')
    const [order, setOrder] = useState('1')
    const [query, setQuery] = useState('')
    const [result, setResult] = useState({ scm: [], sessions: [] })
    const navigate = useNavigate()

    const sessionResultMock = {
        sessions: [
            {
                _id: 1,
                user: 'test',
                location: 'Philippines',
                device: 'Linux',
                status: 'active',
                last_accessed: 'Oct 9th',
            },
        ],
    }

    const fetchData = async () => {
        setLoading(true)
        await axios
            .get(`${import.meta.env.VITE_APP_API_URL}/api/v1/threat/`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_APP_SESSION)}`,
                },
            })
            .then((response) => {
                setResult(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setLoading(false)
            })
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

            <CTabs activeItemKey={1} className="mb-4">
                <CTabList variant="underline-border">
                    <CTab aria-controls="home-tab-pane" itemKey={1}>
                        Sessions
                    </CTab>
                    <CTab aria-controls="profile-tab-pane" itemKey={2}>
                        Dependabot
                    </CTab>
                    <CTab aria-controls="profile-tab-pane" itemKey={3}>
                        OTP
                    </CTab>
                </CTabList>
                <CTabContent>
                    <CTabPanel className="py-3" aria-labelledby="home-tab-pane" itemKey={1}>
                        <Sessions result={result} />
                    </CTabPanel>
                    <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={2}>
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
                    <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={3}>
                        <OTP />
                    </CTabPanel>
                </CTabContent>
            </CTabs>
        </div>
    )
}

export default Security
