import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CCard,
    CCardBody,
    CCardTitle,
    CFormInput,
    CButton,
    CContainer,
    CSpinner,
    CRow,
    CCol,
    CAlert,
    CForm,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faXmark } from '@fortawesome/free-solid-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'
import { useDispatch } from 'react-redux'
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_API_URL, VITE_APP_SESSION } from '../../../config'
import errorMessages from '../../../components/http/ErrorMessages'

const MailOTP = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({
        error: false,
        message: '',
    })
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const token = cookies.get(VITE_APP_SESSION)
    const navigate = useNavigate()
    const recaptchaRef = React.useRef()
    const dispatch = useDispatch()

    const checkAuthentication = async () => {
        if (token === undefined) return navigate('/login')

        await axios
            .post(
                `${VITE_APP_API_URL}/api/v1/auth/verify`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((response) => {
                if (response.data.is_email_verified) return navigate('/')
            })
            .catch((err) => {
                if (!err.response) return console.error(err)
                cookies.remove(VITE_APP_SESSION)
                navigate('/login')
            })
    }

    useEffect(() => {
        checkAuthentication()
    }, [navigate])

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, '')
        if (value.length <= 1) {
            const newOtp = [...otp]
            newOtp[index] = value

            if (value && index < 5) {
                document.getElementById(`otp-input-${index + 1}`).focus()
            }

            setOtp(newOtp)
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-input-${index - 1}`).focus()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()

        const formData = new FormData()
        formData.append('otp', otp)
        formData.append('recaptcha_ref', recaptcha)

        await axios
            .post(`${VITE_APP_API_URL}/api/v1/auth/verify/otp`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.data.error)
                    return setError({
                        error: true,
                        message: response.data.error,
                    })
                const urlParams = new URLSearchParams(window.location.search)
                const url = urlParams.get('n') ? urlParams.get('n') : '/'
                navigate(url)
            })
            .catch((error) => {
                console.error(error)
                const message = errorMessages[error.status] || 'An unexpected error occurred'

                setError({
                    error: true,
                    message,
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <div className="auth-bg" />
            <CContainer>
                {loading && (
                    <div className="loading-overlay">
                        <CSpinner color="primary" variant="grow" />
                    </div>
                )}
                <CRow className="justify-content-center">
                    <CCol md={8} lg={6} xl={5}>
                        <CCard className="p-1 p-md-4 shadow">
                            {error.error && (
                                <CAlert color="danger" className="d-flex align-items-center">
                                    <FontAwesomeIcon
                                        className="flex-shrink-0 me-2"
                                        icon={faXmark}
                                        size="xl"
                                    />
                                    <div>{error.message}</div>
                                </CAlert>
                            )}
                            <CCardBody>
                                <CForm onSubmit={handleSubmit}>
                                    <h1>OTP</h1>
                                    <p className="text-body-secondary">
                                        Enter the 6digit code that was sent to your email address.
                                    </p>
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        size="invisible"
                                        sitekey={VITE_APP_RECAPTCHA_SITE_KEY}
                                    />
                                    <div className="d-flex justify-content-center gap-2 mb-3">
                                        {otp.map((digit, index) => (
                                            <CFormInput
                                                key={index}
                                                type="text"
                                                id={`otp-input-${index}`}
                                                value={digit}
                                                onChange={(e) => handleChange(e, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                className="otp-input"
                                                maxLength="1"
                                            />
                                        ))}
                                    </div>
                                    <CButton type="submit" color="primary" className="me-2 rounded">
                                        Submit
                                    </CButton>
                                </CForm>
                            </CCardBody>
                            <div className="ms-auto">
                                <a
                                    href="https://stats.uptimerobot.com/5l58Mua0Wi"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                                >
                                    System Status
                                </a>
                            </div>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default MailOTP
