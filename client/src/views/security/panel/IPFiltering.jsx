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
    CFormSwitch,
    CButton,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import parseTimestamp from '../../../utils/Timestamp'
import { useToast } from '../../../components/AppToastProvider'
import errorMessages from '../../../utils/ErrorMessages'

const IPFiltering = () => {
    const { addToast } = useToast()
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState([])
    const [query, setQuery] = useState('')
    const [order, setOrder] = useState(0)
    const [priority, setPriority] = useState(0)
    const [state, setState] = useState(0)

    const fetchData = async () => {
        axios
            .get(`/sec/management/ip-filtering`)
            .then((response) => setResult(response.data))
            .catch((error) => {
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        // fetchData()
    }, [])

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    return (
        <div>
            <CRow className="align-items-center mb-2">
                <CCol>
                    <h4 className="mb-0">IP Filtering</h4>
                </CCol>
                <CCol className="text-right d-flex justify-content-end">
                    <CFormSwitch onChange={(e) => console.log(e.target.checked)} />
                </CCol>
            </CRow>
            <CRow className="align-items-center mb-2">
                <CCol className="d-flex align-items-center">
                    <span className="me-3">Filter Mode:</span>
                    <CFormSelect
                        aria-label="Select whitelist or blacklist"
                        onChange={(e) => setState(e.target.value)}
                        className="w-auto"
                    >
                        <option value="0">Whitelist</option>
                        <option value="1">Blacklist</option>
                    </CFormSelect>
                </CCol>
            </CRow>

            <CCard>
                <CCardBody>
                    <div className="mb-2 d-flex justify-content-end">
                        <CButton className="btn btn-primary me-2">New</CButton>
                        <CButton className="btn btn-danger">Delete</CButton>
                    </div>
                    <CTable hover responsive className="table-even-width">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                    <input type="checkbox" />
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                    IP Address
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody></CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>
        </div>
    )
}

export default IPFiltering
