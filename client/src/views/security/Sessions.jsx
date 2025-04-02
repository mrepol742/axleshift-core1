import React, { useState, useEffect } from 'react'
import {
    CCard,
    CCardBody,
    CButton,
    CRow,
    CCol,
    CSpinner,
    CCardTitle,
    CCardText,
    CBadge,
} from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY } from '../../config'
import { useToast } from '../../components/AppToastProvider'
import AppPagination from '../../components/AppPagination'
import parseTimestamp from '../../utils/Timestamp'

const Sessions = () => {
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    const handleLogout = async (id) => {
        const recaptcha = await recaptchaRef.current.executeAsync()
        setLoading(true)
        axios
            .post(`/sec/sessions/logout`, {
                session_id: id,
                recaptcha_ref: recaptcha,
            })
            .then((response) => addToast(response.data.message))
            .catch((error) => {
                const message =
                    error.response?.data?.error ||
                    (error.message === 'network error'
                        ? 'Server is offline or restarting please wait'
                        : error.message)
                addToast(message)
            })
            .finally(() => fetchData())
    }

    const fetchData = async (page) => {
        axios
            .post(`/sec/sessions`, { page })
            .then((response) => {
                setResult(response.data.data)
                setTotalPages(response.data.totalPages)
            })
            .catch((error) => {
                const message =
                    error.response?.data?.error ||
                    (error.message === 'network error'
                        ? 'Server is offline or restarting please wait'
                        : error.message)
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
            <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                <CCol className="mb-3">
                    <h4>This device</h4>
                    <CCard>
                        <CCardBody>
                            <p className="display-3">
                                {result.current_session.ip_address === '::1' ||
                                result.current_session.ip_address === '::ffff:127.0.0.1'
                                    ? 'localhost'
                                    : result.current_session.ip_address}
                            </p>
                            <span className="lead">{result.current_session.user_agent}</span>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol className="mb-3">
                    <h4>Logout other sessions</h4>
                    <CCard>
                        <CCardBody>
                            <p>
                                Clearing all device sessions will log you out from all devices and
                                browsers, except for the one you&apos;re currently using.
                            </p>
                            <CButton
                                type="submit"
                                color="danger"
                                className="mt-4 d-block me-2 rounded"
                                disabled={result.logout}
                                onClick={(e) => handleLogout(null)}
                            >
                                Logout other sessions
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            {result.sessions.map((session, index) => (
                <div key={index}>
                    <CCard className="mb-3">
                        <CCardBody>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h3
                                    className={
                                        (session.active ? 'text-primary' : '') + ' text-truncate'
                                    }
                                >
                                    {session.user_agent}
                                </h3>
                                <CButton
                                    color="outline-danger"
                                    className="border-danger ms-auto"
                                    onClick={(e) => handleLogout(session._id)}
                                >
                                    Logout
                                </CButton>
                            </div>
                            <div className="d-block d-sm-flex">
                                <div className="me-3 mb-2">
                                    <span className="text-muted">Last accessed</span>
                                    <span className="d-block small">
                                        {session.last_accessed
                                            ? parseTimestamp(session.last_accessed)
                                            : 'Never'}{' '}
                                        | {session.active ? 'Verified' : 'Not verified'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted">IP Address</span>
                                    <span className="d-block small text-capitalize">
                                        {session.ip_address === '::1'
                                            ? 'localhost'
                                            : session.ip_address}
                                    </span>
                                </div>
                            </div>
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
            ))}
            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_APP_RECAPTCHA_SITE_KEY} />
        </div>
    )
}

export default Sessions
