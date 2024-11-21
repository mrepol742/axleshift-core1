import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CButton, CRow, CCol, CSpinner } from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_API_URL, VITE_APP_SESSION } from '../../config'
import { useToast } from '../../components/AppToastProvider'
import errorMessages from '../../components/ErrorMessages'

const Sessions = () => {
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState({
        session: [],
        logout: true,
    })

    const handleLogout = async () => {
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()
        await axios
            .post(
                `${VITE_APP_API_URL}/api/v1/sec/sessions/logout`,
                {
                    recaptcha_ref: recaptcha,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                    },
                },
            )
            .then((response) => {
                if (!response.data.error) return window.location.reload()
            })
            .catch((error) => {
                console.error(error)
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    const fetchData = async () => {
        await axios
            .get(`${VITE_APP_API_URL}/api/v1/sec/sessions`, {
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

            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_APP_RECAPTCHA_SITE_KEY} />

            {!loading && (
                <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                    <CCol className="mb-3">
                        <h4>Last login IP Address</h4>
                        <CCard>
                            <CCardBody>
                                <p className="display-3">{result.session.ip_address}</p>
                                <span className="lead">{result.session.user_agent}</span>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol className="mb-3">
                        <h4>Logout other sessions</h4>
                        <CCard>
                            <CCardBody>
                                <p>
                                    Clearing all device sessions will log you out from all devices
                                    and browsers, except for the one you&apos;re currently using.
                                </p>
                                <CButton
                                    type="submit"
                                    color="danger"
                                    className="mt-4 d-block me-2 rounded"
                                    disabled={result.logout}
                                    onClick={handleLogout}
                                >
                                    Logout other sessions
                                </CButton>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            )}
        </div>
    )
}

export default Sessions
