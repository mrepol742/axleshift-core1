import React, { useEffect, useState } from 'react'
import {
    CRow,
    CCol,
    CCard,
    CCardTitle,
    CButton,
    CSpinner,
    CCardBody,
    CTable,
    CTableHead,
    CTableRow,
    CTableDataCell,
    CTableBody,
    CTableHeaderCell,
} from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import parseTimestamp from '../../../utils/Timestamp'
import { VITE_APP_RECAPTCHA_SITE_KEY } from '../../../config'
import { useToast } from '../../../components/AppToastProvider'
import errorMessages from '../../../utils/ErrorMessages'
import AppPagination from '../../../components/AppPagination'

const AccessToken = () => {
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState({
        apiToken: [],
        deny: true,
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    const handleDeactivation = async () => {
        const recaptcha = await recaptchaRef.current.executeAsync()
        setLoading(true)
        axios
            .post(`/sec/management/apikeys/deactivate`, {
                recaptcha_ref: recaptcha,
            })
            .then((response) => window.location.reload())
            .catch((error) => {
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    const fetchData = async (page) => {
        axios
            .post(`/sec/management/apikeys`, { page })
            .then((response) => {
                setResult(response.data.data)
                setTotalPages(response.data.totalPages)
            })
            .catch((error) => {
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
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

    if (result.apiToken.length == 0)
        return (
            <CRow className="justify-content-center my-5">
                <CCol md={6}>
                    <div className="clearfix">
                        <h1 className="float-start display-3 me-4">OOPS</h1>
                        <h4>There was no apikeys yet.</h4>
                        <p>Check it out later</p>
                    </div>
                </CCol>
            </CRow>
        )

    return (
        <div>
            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_APP_RECAPTCHA_SITE_KEY} />

            <h4>Deactivate all apikeys</h4>
            <CCard className="mb-3">
                <CCardBody>
                    <p>Clearing all active apikeys will deny future incoming requests.</p>
                    <CButton
                        type="submit"
                        color="danger"
                        className="mt-4 d-block me-2 rounded"
                        disabled={result.deny}
                        onClick={handleDeactivation}
                    >
                        <FontAwesomeIcon icon={faCircleExclamation} className="me-2" /> Deactivate
                        all apikeys
                    </CButton>
                </CCardBody>
            </CCard>
            <CCard>
                <CCardBody>
                    <CCardTitle>API keys</CCardTitle>
                    <CTable hover responsive className="table-even-width">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                    User
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                    Status
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                    Token
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                    Whitelist
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                    Device
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                    Last Accessed
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {result.apiToken.map((token, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>{token.user_id}</CTableDataCell>
                                    <CTableDataCell>
                                        {token.active ? 'Active' : 'Inactive'}
                                    </CTableDataCell>
                                    <CTableDataCell>{token.token}</CTableDataCell>
                                    <CTableDataCell>
                                        {token.whitelist_ip.map((ip) => ip.split(',')[0]).join(' ')}
                                    </CTableDataCell>
                                    <CTableDataCell>{token.user_agent}</CTableDataCell>
                                    <CTableDataCell>
                                        {token.last_accessed
                                            ? parseTimestamp(token.last_accessed)
                                            : 'Never'}
                                    </CTableDataCell>
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

export default AccessToken
