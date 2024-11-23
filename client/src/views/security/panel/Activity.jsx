import React, { useState, useEffect } from 'react'
import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CSpinner,
    CCard,
    CCardBody,
    CCardTitle,
} from '@coreui/react'
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_API_URL, VITE_APP_SESSION } from '../../../config'
import { useToast } from '../../../components/AppToastProvider'
import errorMessages from '../../../components/ErrorMessages'
import { parseTimestamp } from '../../../components/Timestamp'

const Activity = () => {
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])

    const fetchData = async () => {
        await axios
            .get(`${VITE_APP_API_URL}/api/v1/sec/management/activity`, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => setResult(response.data))
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

            {!loading && (
                <CCard>
                    <CCardBody>
                        <CCardTitle>Activity Logs</CCardTitle>
                        <CTable hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell className="text-muted poppins-regular">
                                        Actor
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-muted poppins-regular">
                                        Type
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-muted poppins-regular">
                                        Message
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-muted poppins-regular">
                                        Created At
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {result.map((log, index) => (
                                    <CTableRow key={index}>
                                        <CTableDataCell>{log.user_id}</CTableDataCell>
                                        <CTableDataCell>{log.type}</CTableDataCell>
                                        <CTableDataCell>{log.message}</CTableDataCell>
                                        <CTableDataCell>
                                            {parseTimestamp(log.created_at)}
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            )}
        </div>
    )
}

export default Activity
