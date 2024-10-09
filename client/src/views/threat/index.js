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
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import Cookies from 'js-cookie'

const Threat = () => {
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState('2')
    const [priority, setPriority] = useState('1')
    const [order, setOrder] = useState('1')
    const [query, setQuery] = useState('')
    const [result, setResult] = useState({ scm: [] })
    const navigate = useNavigate()

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
            {result.scm.length === 0 && (
                <>
                    <div className="text-center border rounded">
                        <div className="p-0 p-md-5 my-5 my-md-0">
                            <CImage src="/images/threat.png" fluid width="50%" />
                            <h1>We couldn&apos;t find any threats.</h1>
                            <p>Should we add one? :)</p>
                        </div>
                    </div>
                </>
            )}
            {result.scm.length !== 0 && (
                <>
                    <CInputGroup>
                        <CFormInput
                            aria-label="tracking id"
                            aria-describedby="basic-addon"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <CInputGroupText id="basic-addon">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </CInputGroupText>
                    </CInputGroup>
                    <CForm className="d-flex justify-content-left my-2 my-lg-0 overflow-scroll no-scrollbar">
                        <CFormSelect
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            options={[
                                { label: 'All', value: '0' },
                                { label: 'Resolved', value: '1' },
                                { label: 'Unresolved', value: '2' },
                                { label: 'Not Plan', value: '3' },
                            ]}
                            required
                            className="mb-3"
                        />
                        <div className="mx-2"></div>
                        <CFormSelect
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            options={[
                                { label: 'All', value: '0' },
                                { label: 'High', value: '1' },
                                { label: 'Medium', value: '2' },
                                { label: 'Low', value: '3' },
                            ]}
                            required
                            className="mb-3"
                        />
                        <div className="mx-2"></div>
                        <CFormSelect
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            options={[
                                { label: 'Newer', value: '1' },
                                { label: 'Older', value: '2' },
                            ]}
                            required
                            className="mb-3"
                        />
                        <div className="mx-2"></div>
                    </CForm>

                    <CTable striped>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>#</CTableHeaderCell>
                                <CTableHeaderCell>State</CTableHeaderCell>
                                <CTableHeaderCell>Scope</CTableHeaderCell>
                                <CTableHeaderCell>Manifest</CTableHeaderCell>
                                <CTableHeaderCell>CVE</CTableHeaderCell>
                                <CTableHeaderCell>Summary</CTableHeaderCell>
                                <CTableHeaderCell>Severity</CTableHeaderCell>
                                <CTableHeaderCell>Updated At</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {result.scm.map((alert) => (
                                <CTableRow key={alert.number}>
                                    <CTableDataCell>{alert.number}</CTableDataCell>
                                    <CTableDataCell>{alert.state}</CTableDataCell>
                                    <CTableDataCell>{alert.scope}</CTableDataCell>
                                    <CTableDataCell>{alert.manifest}</CTableDataCell>
                                    <CTableDataCell>{alert.cve}</CTableDataCell>
                                    <CTableDataCell>{alert.summary}</CTableDataCell>
                                    <CTableDataCell>{alert.severity}</CTableDataCell>
                                    <CTableDataCell>
                                        {new Date(alert.updated_at).toLocaleString()}
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

export default Threat
