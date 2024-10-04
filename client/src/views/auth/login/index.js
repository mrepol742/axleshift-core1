import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import {
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
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
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

    useEffect(() => {
        if (Cookies.get(import.meta.env.VITE_APP_SESSION) !== undefined) navigate('/')
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()

        try {
            const formData = new FormData()
            formData.append('email', email)
            formData.append('password', password)
            formData.append('recaptcha_ref', recaptcha)

            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_URL}/api/auth/login`,
                formData,
                {
                    headers: {},
                },
            )
            const status = response.data.status
            if (status != 200) return alert(status)
            Cookies.set(import.meta.env.VITE_APP_SESSION, response.data.token)
            const urlParams = new URLSearchParams(window.location.search)
            let url = '/'
            if (urlParams.has('n')) {
                url = urlParams.get('n')
            }
            dispatch({ type: 'set', email: email })
            navigate(url)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
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
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default Login
