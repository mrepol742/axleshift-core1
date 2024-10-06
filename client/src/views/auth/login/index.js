import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
    CButtonGroup,
    CSpinner,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faXmark } from '@fortawesome/free-solid-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'
import { useDispatch } from 'react-redux'

const Login = () => {
    const VITE_APP_RECAPTCHA_SITE_KEY = import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY
    const navigate = useNavigate()
    const recaptchaRef = React.useRef()
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({
        error: false,
        message: '',
    })
    const errorMessages = {
        401: 'You failed the robot test',
        429: 'Too many attempts',
        401: 'Invalid password',
        404: 'Email address not found',
        500: 'Internal server error',
    }

    useEffect(() => {
        if (Cookies.get(import.meta.env.VITE_APP_SESSION) !== undefined) return navigate('/')
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()

        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)
        formData.append('recaptcha_ref', recaptcha)

        await axios
            .post(`${import.meta.env.VITE_APP_API_URL}/api/v1/auth/login`, formData, {
                headers: {},
            })
            .then((response) => {
                setLoading(false)
                Cookies.set(import.meta.env.VITE_APP_SESSION, response.data.token)
                const urlParams = new URLSearchParams(window.location.search)
                const url = urlParams.get('n') ? urlParams.get('n') : '/'
                dispatch({ type: 'set', email: email })
                navigate(url)
            })
            .catch((error) => {
                setLoading(false)
                const message = errorMessages[error.status] || 'An unexpected error occurred'

                setError({
                    error: true,
                    message,
                })
            })
    }

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                {loading && (
                    <div className="loading-overlay">
                        <CSpinner color="primary" variant="grow" />
                    </div>
                )}
                <CRow className="justify-content-center">
                    <CCol md={8} lg={6} xl={5}>
                        <CCard className="p-4">
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
                                    <h1>Login</h1>
                                    <p className="text-body-secondary">Sign In to your account</p>
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        size="invisible"
                                        sitekey={VITE_APP_RECAPTCHA_SITE_KEY}
                                    />
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <FontAwesomeIcon icon={faEnvelope} />
                                        </CInputGroupText>
                                        <CFormInput
                                            type="email"
                                            placeholder="Email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </CInputGroup>
                                    <CInputGroup className="mb-4">
                                        <CInputGroupText>
                                            <FontAwesomeIcon icon={faLock} />
                                        </CInputGroupText>
                                        <CFormInput
                                            type="password"
                                            placeholder="Password"
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </CInputGroup>
                                    <div className="d-grid">
                                        <CButtonGroup>
                                            <CButton
                                                type="submit"
                                                color="primary"
                                                className="me-2 rounded"
                                            >
                                                Login
                                            </CButton>
                                            <CButton
                                                color="success"
                                                className="me-2 rounded"
                                                onClick={() => navigate('/register')}
                                            >
                                                Signup
                                            </CButton>
                                        </CButtonGroup>
                                    </div>
                                    <CButton
                                        color="link"
                                        className="px-0"
                                        onClick={() => navigate('/forgot-password')}
                                    >
                                        Forgot password?
                                    </CButton>
                                </CForm>
                            </CCardBody>
                        </CCard>
                        <div className="ms-auto">
                            <a
                                href="https://stats.uptimerobot.com/5l58Mua0Wi"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                System Status
                            </a>
                        </div>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default Login
