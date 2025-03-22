import React, { useEffect, useState } from 'react'
import {
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CForm,
    CFormSelect,
    CRow,
    CCol,
    CCard,
    CCardTitle,
    CSpinner,
    CCardBody,
    CTable,
    CTableHead,
    CTableRow,
    CTableDataCell,
    CTableBody,
    CTableHeaderCell,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import parseTimestamp from '../../../utils/Timestamp'
import { useToast } from '../../../components/AppToastProvider'

const Dependabot = () => {
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])

    const fetchData = async () => {
        axios
            .get(`/sec/management/dependabot`)
            .then((response) => setResult(response.data))
            .catch((error) => {
                const message =
                    error.response?.data?.error || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    if (result.length === 0)
        return (
            <CRow className="justify-content-center my-5">
                <CCol md={6}>
                    <div className="clearfix">
                        <h1 className="float-start display-3 me-4">OOPS</h1>
                        <h4>There was no alerts yet.</h4>
                        <p>Check it out later</p>
                    </div>
                </CCol>
            </CRow>
        )

    return (
        <div>
            <CCard>
                <CCardBody>
                    <CCardTitle>Vulnerability Alerts</CCardTitle>
                    <CTable hover responsive className="table-even-width">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                    State
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                    Scope
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                    Manifest
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                    CVE
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                    Summary
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                    Severity
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                    Last Updated
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {result.map((alert, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>{alert.state}</CTableDataCell>
                                    <CTableDataCell>{alert.scope}</CTableDataCell>
                                    <CTableDataCell>{alert.manifest}</CTableDataCell>
                                    <CTableDataCell>{alert.cve}</CTableDataCell>
                                    <CTableDataCell>{alert.summary}</CTableDataCell>
                                    <CTableDataCell>{alert.severity}</CTableDataCell>
                                    <CTableDataCell>
                                        {parseTimestamp(new Date(alert.updated_at).getTime())}
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>
        </div>
    )
}

export default Dependabot
