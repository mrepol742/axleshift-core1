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
import { useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faUser, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'
import {
    VITE_APP_RECAPTCHA_SITE_KEY,
    VITE_APP_API_URL,
    VITE_APP_SESSION,
    VITE_APP_GITHUB_OAUTH_CLIENT_ID,
} from '../../config'
import errorMessages from '../../components/http/ErrorMessages'

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
    const [loading, setLoading] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
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

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    const handleSubmit = async (e, type, credential) => {
        if (e) e.preventDefault()
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()

        const formDataToSend = new FormData()
        if (type === 'form') {
            for (const key in formData) {
                formDataToSend.append(key, formData[key])
            }
        } else if (type === 'google') {
            formDataToSend.append('credential', credential)
        } else {
            setLoading(false)
            setError({
                error: true,
                message: 'An unexpected error occurred',
            })
            return
        }
        formDataToSend.append('type', type)
        formDataToSend.append('recaptcha_ref', recaptcha)
        formDataToSend.append('newsletter', isChecked)

        await axios
            .post(`${VITE_APP_API_URL}/api/v1/auth/register`, formDataToSend, {
                headers: {},
            })
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
                console.error(error)
                const message = errorMessages[error.status] || 'An unexpected error occurred'

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
                                    <h1>Register</h1>
                                    <p className="text-body-secondary">Create your account</p>
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
                                            id="email"
                                            type="email"
                                            placeholder="Email"
                                            autoComplete="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange(e)}
                                            required
                                        />
                                    </CInputGroup>
                                    <CRow>
                                        <CCol md={6} className="mb-3">
                                            <CInputGroup>
                                                <CInputGroupText>
                                                    <FontAwesomeIcon icon={faUser} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    id="first_name"
                                                    type="text"
                                                    placeholder="First Name"
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
                                                    placeholder="Last Name"
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
                                            type="password"
                                            placeholder="Password"
                                            autoComplete="new-password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange(e)}
                                            required
                                        />
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
                                        className="mb-1"
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
