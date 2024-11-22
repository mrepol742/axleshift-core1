import React, { useState, useEffect } from 'react'
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

const Sentry = () => {
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])
    const [query, setQuery] = useState('')
    const [order, setOrder] = useState(0)
    const [priority, setPriority] = useState(0)
    const [state, setState] = useState(0)

    const fetchData = async () => {
        await axios
            .get(`${VITE_APP_API_URL}/api/v1/sec/management/sentry`, {
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
                <CRow className="justify-content-center my-5">
                    <CCol md={6}>
                        <div className="clearfix">
                            <h1 className="float-start display-3 me-4">OOPS</h1>
                            <h4>There was no issues yet.</h4>
                            <p>Check it out later</p>
                        </div>
                    </CCol>
                </CRow>
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
                                <CTableHeaderCell>Title</CTableHeaderCell>
                                <CTableHeaderCell>Culprit</CTableHeaderCell>
                                <CTableHeaderCell>Level</CTableHeaderCell>
                                <CTableHeaderCell>Status</CTableHeaderCell>
                                <CTableHeaderCell>Priority</CTableHeaderCell>
                                <CTableHeaderCell>Count</CTableHeaderCell>
                                <CTableHeaderCell>Last Updated</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {result.map((issue) => (
                                <CTableRow key={issue.id}>
                                    <CTableDataCell>{issue.id}</CTableDataCell>
                                    <CTableDataCell>{issue.title}</CTableDataCell>
                                    <CTableDataCell>{issue.culprit}</CTableDataCell>
                                    <CTableDataCell>{issue.level}</CTableDataCell>
                                    <CTableDataCell>{issue.status}</CTableDataCell>
                                    <CTableDataCell>{issue.priority}</CTableDataCell>
                                    <CTableDataCell>{issue.count}</CTableDataCell>
                                    <CTableDataCell>
                                        {parseTimestamp(new Date(issue.updated_at).getTime())}
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

export default Sentry
