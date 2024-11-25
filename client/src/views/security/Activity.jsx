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
import { useToast } from '../../components/AppToastProvider'
import errorMessages from '../../components/ErrorMessages'
import { parseTimestamp } from '../../components/Timestamp'

const Activity = () => {
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])

    const fetchData = async () => {
        axios
            .get(`/sec/activity`)
            .then((response) => setResult(response.data))
            .catch((error) => {
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
                <CCard className="mb-4">
                    <CCardBody>
                        <CCardTitle>Activity Logs</CCardTitle>
                        <CTable hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                        Event
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                        Location
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                        Device
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                        Time
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {result.map((log, index) => (
                                    <CTableRow key={index}>
                                        <CTableDataCell>{log.event}</CTableDataCell>
                                        <CTableDataCell>
                                            {log.ip_address === '::1' ||
                                            log.ip_address === '::ffff:127.0.0.1'
                                                ? 'localhost'
                                                : log.ip_address}
                                        </CTableDataCell>
                                        <CTableDataCell>{log.user_agent}</CTableDataCell>
                                        <CTableDataCell>{parseTimestamp(log.time)}</CTableDataCell>
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
