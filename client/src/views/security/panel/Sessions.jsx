import React, { useEffect, useState } from 'react'
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
import { parseTimestamp } from '../../../components/Timestamp'
import { VITE_APP_API_URL, VITE_APP_SESSION } from '../../../config'
import { useToast } from '../../../components/AppToastProvider'
import errorMessages from '../../../components/ErrorMessages'

const Sessions = () => {
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])

    const fetchData = async () => {
        await axios
            .get(`${VITE_APP_API_URL}/api/v1/sec/management/sessions`, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => {
                if (!response.data.error) setResult(response.data)
            })
            .catch((error) => {
                console.error(error)
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message)
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

            {result && (
                <>
                    <h4>Logout all sessions</h4>
                    <CCard className="mb-3">
                        <CCardBody>
                            <p>Clearing all active sessions will log everyone out.</p>
                            <CButton
                                type="submit"
                                color="danger"
                                className="mt-4 d-block me-2 rounded"
                                disabled
                            >
                                Logout all sessions
                            </CButton>
                        </CCardBody>
                    </CCard>
                    <CTable hover responsive className="rounded">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>#</CTableHeaderCell>
                                <CTableHeaderCell>User</CTableHeaderCell>
                                <CTableHeaderCell>Location</CTableHeaderCell>
                                <CTableHeaderCell>Device</CTableHeaderCell>
                                <CTableHeaderCell>Status</CTableHeaderCell>
                                <CTableHeaderCell>Last Accessed</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {result.map((session, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>{index + 1}</CTableDataCell>
                                    <CTableDataCell>{session.user_id}</CTableDataCell>
                                    <CTableDataCell>{session.ip_address}</CTableDataCell>
                                    <CTableDataCell>{session.user_agent}</CTableDataCell>
                                    <CTableDataCell>
                                        {session.active ? 'Active' : 'Inactive'}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        {parseTimestamp(session.last_accessed)}
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </>
            )}
        </div>
    )
}

export default Sessions
