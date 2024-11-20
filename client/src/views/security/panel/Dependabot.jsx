import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
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
import { parseTimestamp } from '../../../components/Timestamp'
import { VITE_APP_API_URL, VITE_APP_SESSION } from '../../../config'
import { useToast } from '../../../components/AppToastProvider'
import errorMessages from '../../../components/ErrorMessages'

const Dependabot = () => {
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])
    const [query, setQuery] = useState('')
    const [order, setOrder] = useState(0)
    const [priority, setPriority] = useState(0)
    const [state, setState] = useState(0)

    const fetchData = async () => {
        await axios
            .get(`${VITE_APP_API_URL}/api/v1/sec/management/dependabot`, {
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

            {result.length === 0 && !loading && (
                <div className="text-center border rounded">
                    <div className="p-0 p-md-5 my-5 my-md-0">
                        <CImage src="/images/threat.png" fluid width="50%" loading="lazy" />
                        <h1>We couldn&apos;t find any threats.</h1>
                        <p>Should we add one? :)</p>
                    </div>
                </div>
            )}
            {result.length !== 0 && (
                <>
                    <CForm className="d-flex justify-content-left my-2 my-lg-0">
                        <CInputGroup className="mb-3">
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
                        <div className="mx-2"></div>
                        <CFormSelect
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            options={[
                                { label: 'All', value: 0 },
                                { label: 'Resolved', value: 1 },
                                { label: 'Unresolved', value: 2 },
                                { label: 'Not Plan', value: 3 },
                            ]}
                            required
                            className="mb-3"
                        />
                        <div className="mx-2"></div>
                        <CFormSelect
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            options={[
                                { label: 'All', value: 0 },
                                { label: 'High', value: 1 },
                                { label: 'Medium', value: 2 },
                                { label: 'Low', value: 3 },
                            ]}
                            required
                            className="mb-3"
                        />
                        <div className="mx-2"></div>
                        <CFormSelect
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            options={[
                                { label: 'Newer', value: 1 },
                                { label: 'Older', value: 2 },
                            ]}
                            required
                            className="mb-3"
                        />
                    </CForm>

                    <CTable hover responsive className="rounded">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>#</CTableHeaderCell>
                                <CTableHeaderCell>State</CTableHeaderCell>
                                <CTableHeaderCell>Scope</CTableHeaderCell>
                                <CTableHeaderCell>Manifest</CTableHeaderCell>
                                <CTableHeaderCell>CVE</CTableHeaderCell>
                                <CTableHeaderCell>Summary</CTableHeaderCell>
                                <CTableHeaderCell>Severity</CTableHeaderCell>
                                <CTableHeaderCell>Last Updated</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {result.map((alert) => (
                                <CTableRow key={alert.number}>
                                    <CTableDataCell>{alert.number}</CTableDataCell>
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
                </>
            )}
        </div>
    )
}

export default Dependabot
