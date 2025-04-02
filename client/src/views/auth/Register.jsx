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
    CFormCheck,
} from '@coreui/react'
import { useGoogleLogin } from '@react-oauth/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEnvelope,
    faLock,
    faUser,
    faXmark,
    faEye,
    faEyeSlash,
} from '@fortawesome/free-solid-svg-icons'
import { faGithub, faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'
import {
    VITE_APP_RECAPTCHA_SITE_KEY,
    VITE_APP_SESSION,
    VITE_APP_GITHUB_OAUTH_CLIENT_ID,
} from '../../config'

const Register = () => {
    const navigate = useNavigate()
    const recaptchaRef = React.useRef()
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        repeat_password: '',
    })
    const [loading, setLoading] = useState(true)
    const [isChecked, setIsChecked] = useState(false)
    const [error, setError] = useState({
        error: false,
        message: '',
    })
    const urlParams = new URLSearchParams(window.location.search)
    const url = urlParams.get('n') ? urlParams.get('n') : '/auth/verify'
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

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
        setLoading(false)
    }, [])

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    const handleSubmit = async (e, type, credential) => {
        if (e) e.preventDefault()
        if (!navigator.geolocation)
            setError({
                error: true,
                message: 'Geolocation is not supported by this browser. Registration halted!',
            })

        navigator.geolocation.getCurrentPosition(
            (position) => {
                register(e, type, credential, {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            },
            (error) => {
                let errorMessage
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'We need your location to continue.'
                        break
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.'
                        break
                    case error.TIMEOUT:
                        errorMessage = 'Timeout occurred while getting your location.'
                        break
                    default:
                        errorMessage = 'An unknown error occurred. Please try again later.'
                }
                setError({
                    error: true,
                    message: errorMessage,
                })
                return true
            },
        )
    }

    const register = async (e, type, credential, location) => {
        const recaptcha = await recaptchaRef.current.executeAsync()
        setLoading(true)
        const formDataToSend = {}
        if (type === 'form') {
            for (const key in formData) {
                formDataToSend[key] = formData[key]
            }
        } else if (type === 'google') {
            formDataToSend['credential'] = credential
        } else {
            setLoading(false)
            setError({
                error: true,
                message: 'Server is offline or restarting please wait',
            })
            return
        }
        formDataToSend['type'] = type
        formDataToSend['recaptcha_ref'] = recaptcha
        formDataToSend['newsletter'] = isChecked
        formDataToSend['location'] = JSON.stringify(location)

        axios
            .post(`/auth/register`, formDataToSend)
            .then((response) => {
                if (response.data.error)
                    return setError({
                        error: true,
                        message: response.data.error,
                    })
                if (response.data.type === 'form') return navigate(`/login${url}`)
                cookies.set(VITE_APP_SESSION, response.data.token, { expires: 30 })
                window.location.href = url
            })
            .catch((error) => {
                const message =
                    error.response?.data?.error ||
                    error.message ||
                    'Server is offline or restarting please wait'

                setError({
                    error: true,
                    message,
                })
            })
            .finally(() => setLoading(false))
    }

    return (
        <div className="bg-dark min-vh-100 d-flex flex-row align-items-center">
            <div className="auth-bg" />
            <CContainer>
                {loading && (
                    <div className="loading-overlay">
                        <CSpinner color="primary" variant="grow" />
                    </div>
                )}

                <CRow className="justify-content-center">
                    <CCol md={8} lg={6} xl={5} className="my-2">
                        <CCard className="p-1 p-sm-4 shadow">
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
                                    <h1>Axleshift</h1>
                                    <p className="text-body-secondary">Create your account</p>
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        size="invisible"
                                        sitekey={VITE_APP_RECAPTCHA_SITE_KEY}
                                    />
                                    <CRow>
                                        <CCol md={6} className="mb-3">
                                            <CInputGroup>
                                                <CInputGroupText>
                                                    <FontAwesomeIcon icon={faUser} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    id="username"
                                                    type="text"
                                                    placeholder="Username"
                                                    autoComplete="username"
                                                    value={formData.username}
                                                    onChange={(e) => handleInputChange(e)}
                                                    required
                                                />
                                            </CInputGroup>
                                        </CCol>
                                        <CCol md={6} className="mb-3">
                                            <CInputGroup>
                                                <CInputGroupText>
                                                    <FontAwesomeIcon icon={faEnvelope} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    id="email"
                                                    type="email"
                                                    placeholder="Email"
                                                    autoComplete="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange(e)}
                                                    required
                                                />
                                            </CInputGroup>
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol md={6} className="mb-3">
                                            <CInputGroup>
                                                <CInputGroupText>
                                                    <FontAwesomeIcon icon={faUser} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    id="first_name"
                                                    type="text"
                                                    placeholder="First name"
                                                    autoComplete="given-name"
                                                    value={formData.first_name}
                                                    onChange={(e) => handleInputChange(e)}
                                                    required
                                                />
                                            </CInputGroup>
                                        </CCol>
                                        <CCol md={6} className="mb-3">
                                            <CInputGroup>
                                                <CInputGroupText>
                                                    <FontAwesomeIcon icon={faUser} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    id="last_name"
                                                    type="text"
                                                    placeholder="Last name"
                                                    autoComplete="family-name"
                                                    value={formData.last_name}
                                                    onChange={(e) => handleInputChange(e)}
                                                    required
                                                />
                                            </CInputGroup>
                                        </CCol>
                                    </CRow>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <FontAwesomeIcon icon={faLock} />
                                        </CInputGroupText>
                                        <CFormInput
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                            autoComplete="current"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange(e)}
                                            required
                                        />
                                        <CInputGroupText>
                                            <span
                                                onClick={togglePasswordVisibility}
                                                aria-label={
                                                    showPassword ? 'Hide password' : 'Show password'
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={showPassword ? faEyeSlash : faEye}
                                                    onClick={togglePasswordVisibility}
                                                />
                                            </span>
                                        </CInputGroupText>
                                    </CInputGroup>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <FontAwesomeIcon icon={faLock} />
                                        </CInputGroupText>
                                        <CFormInput
                                            id="repeat_password"
                                            type="password"
                                            placeholder="Repeat password"
                                            autoComplete="new-password"
                                            value={formData.repeat_password}
                                            onChange={(e) => handleInputChange(e)}
                                            required
                                        />
                                    </CInputGroup>
                                    <CFormCheck
                                        id="newsletter"
                                        className="mb-1 small"
                                        checked={isChecked}
                                        onChange={(e) => setIsChecked(event.target.checked)}
                                        label="Subscribe to our newsletter"
                                    />
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
                                                Create Account
                                            </CButton>
                                            <CButton
                                                color="outline-primary"
                                                className="me-2 rounded"
                                                onClick={() => navigate(`/login?n=${url}`)}
                                            >
                                                Login
                                            </CButton>
                                        </CButtonGroup>
                                    </div>
                                    <span className="small text-muted d-block mb-1">
                                        or continue with
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
                                    <CButton color="outline-primary" className="me-2" disabled>
                                        <FontAwesomeIcon icon={faMicrosoft} />
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

export default Register
