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

import parseTimestamp from '../../utils/Timestamp'

const Sessions = () => {
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState({
        sessions: [],
        current_session: [],
        logout: true,
    })

    const handleLogout = async (id) => {
        const recaptcha = await recaptchaRef.current.executeAsync()
        setLoading(true)
        axios
            .post(`/sec/sessions/logout`, {
                session_id: id,
                recaptcha_ref: recaptcha,
            })
            .then((response) => window.location.reload())
            .catch((error) => {
                const message =
                    error.response?.data?.error || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    const fetchData = async () => {
        axios
            .get(`/sec/sessions`)
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

    return (
        <div>
            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_APP_RECAPTCHA_SITE_KEY} />

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
                <CCard key={index} className="mb-3">
                    <CCardBody>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <CBadge color="primary" className="me-2">
                                    {parseTimestamp(session.last_accessed)}
                                </CBadge>
                                <CCardTitle>{session.user_agent}</CCardTitle>
                                <CCardText>
                                    {session.ip_address === '::1' ||
                                    session.ip_address === '::ffff:127.0.0.1'
                                        ? 'localhost'
                                        : session.ip_address}
                                </CCardText>
                            </div>
                            <CButton color="danger" onClick={(e) => handleLogout(session._id)}>
                                Logout
                            </CButton>
                        </div>
                    </CCardBody>
                </CCard>
            ))}
        </div>
    )
}

export default Sessions
