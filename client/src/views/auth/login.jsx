import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'
import {
    VITE_APP_RECAPTCHA_SITE_KEY,
    VITE_APP_SESSION,
    VITE_APP_API_URL,
    VITE_APP_GITHUB_OAUTH_CLIENT_ID,
} from '../../config'
import errorMessages from '../../components/ErrorMessages'

const Login = () => {
    const navigate = useNavigate()
    const recaptchaRef = React.useRef()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({
        error: false,
        message: '',
    })
    const urlParams = new URLSearchParams(window.location.search)
    const url = urlParams.get('n') ? urlParams.get('n') : '/'
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (credentialResponse) => {
            handleSubmit(null, 'google', credentialResponse.access_token)
        },
        onError: () => {
            setError({
                error: true,
                message: 'Please try again later',
            })
        },
    })

    useEffect(() => {
        if (cookies.get(VITE_APP_SESSION) !== undefined) return (window.location.href = url)
    }, [])

    const handleSubmit = async (e, type, credential) => {
        if (e) e.preventDefault()
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()

        const formData = new FormData()
        if (type === 'form') {
            formData.append('email', email)
            formData.append('password', password)
        } else if (type === 'google') {
            formData.append('credential', credential)
        } else {
            setLoading(false)
            setError({
                error: true,
                message: 'Internal Application Error',
            })
            return
        }
        formData.append('type', type)
        formData.append('recaptcha_ref', recaptcha)

        await axios
            .post(`${VITE_APP_API_URL}/api/v1/auth/login`, formData, {
                headers: {},
            })
            .then((response) => {
                if (response.data.error)
                    return setError({
                        error: true,
                        message: response.data.error,
                    })

                cookies.set(VITE_APP_SESSION, response.data.token, { expires: 30 })
                window.location.href = url
            })
            .catch((error) => {
                console.error(error)
                const message = errorMessages[error.status] || 'Internal Application Error'

                setError({
                    error: true,
                    message,
                })
            })
            .finally(() => setLoading(false))
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
                    <CCol md={8} lg={6} xl={5} className="my-2">
                        <CCard className="p-1 p-md-4 shadow">
                            <CCardBody>
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
                                <CForm onSubmit={(e) => handleSubmit(e, 'form', null)}>
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
                                    <CInputGroup className="mb-3">
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
                                    <p>
                                        <small>
                                            By continuing, you agree to our
                                            <a
                                                className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                                                onClick={() => navigate('/privacy-policy')}
                                            >
                                                {' '}
                                                Privacy Policy{' '}
                                            </a>
                                            and
                                            <a
                                                className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                                                onClick={() => navigate('/terms-of-service')}
                                            >
                                                {' '}
                                                Terms of Service
                                            </a>
                                            .
                                        </small>
                                    </p>
                                    <div className="d-grid mb-3">
                                        <CButtonGroup>
                                            <CButton
                                                type="submit"
                                                color="primary"
                                                className="me-2 rounded"
                                            >
                                                Login
                                            </CButton>
                                            <CButton
                                                color="outline-primary"
                                                className="me-2 rounded"
                                                onClick={() => navigate(`/register?n=${url}`)}
                                            >
                                                Signup
                                            </CButton>
                                        </CButtonGroup>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-muted d-block mb-1">
                                            Or continue with
                                        </span>
                                        <CButton
                                            color="outline-primary"
                                            className="me-2"
                                            onClick={handleGoogleLogin}
                                        >
                                            <FontAwesomeIcon icon={faGoogle} />
                                        </CButton>
                                        <CButton
                                            color="outline-primary"
                                            className="me-2"
                                            onClick={() =>
                                                (window.location.href = `https://github.com/login/oauth/authorize?client_id=${VITE_APP_GITHUB_OAUTH_CLIENT_ID}`)
                                            }
                                        >
                                            <FontAwesomeIcon icon={faGithub} />
                                        </CButton>
                                    </div>
                                    <CButton
                                        color="link"
                                        className="px-0 link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
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
