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
import { useToast } from '../../../components/AppToastProvider'

import parseTimestamp from '../../../utils/Timestamp'
import AppPagination from '../../../components/AppPagination'

const Activity = () => {
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    const fetchData = async (page) => {
        axios
            .post(`/sec/management/activity`, { page })
            .then((response) => {
                setResult(response.data.data)
                setTotalPages(response.data.totalPages)
            })
            .catch((error) => {
                const message =
                    error.response?.data?.error || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData(currentPage)
    }, [currentPage])

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    return (
        <div>
            <CCard className="mb-4">
                <CCardBody>
                    <CCardTitle>Activity Logs</CCardTitle>
                    <CTable stripedColumns hover responsive className="table-even-width">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell className="text-uppercase fw-bold text-muted poppins-regular table-header-cell-no-wrap">
                                    User ID
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-uppercase fw-bold text-muted poppins-regular table-header-cell-no-wrap">
                                    Session ID
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-uppercase fw-bold text-muted poppins-regular table-header-cell-no-wrap">
                                    Event
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-uppercase fw-bold text-muted poppins-regular table-header-cell-no-wrap">
                                    Location
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-uppercase fw-bold text-muted poppins-regular table-header-cell-no-wrap">
                                    Device
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-uppercase fw-bold text-muted poppins-regular table-header-cell-no-wrap">
                                    Time
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {result.map((log, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>{log.user_id}</CTableDataCell>
                                    <CTableDataCell>{log.session_id}</CTableDataCell>
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
            {totalPages > 1 && (
                <AppPagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    setTotalPages={setTotalPages}
                />
            )}
        </div>
    )
}

export default Activity
