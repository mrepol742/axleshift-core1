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
import { GoogleLogin } from '@react-oauth/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faUser, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
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
        recaptcha_ref: '',
    })
    const [loading, setLoading] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
    const [error, setError] = useState({
        error: false,
        message: '',
    })
    const urlParams = new URLSearchParams(window.location.search)
    const url = urlParams.get('n') ? urlParams.get('n') : '/'

    useEffect(() => {
        if (cookies.get(VITE_APP_SESSION) !== undefined) return navigate(url)
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
                // this is just a test
                if (key == 'newsletter') return alert(formData[key])
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
        if (isChecked) formDataToSend.append('newsletter', 'true')

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
                                            name="email"
                                            placeholder="Email"
                                            autoComplete="email"
                                            //          value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </CInputGroup>
                                    <CRow>
                                        <CCol md={6} className="mb-3">
                                            <CInputGroup>
                                                <CInputGroupText>
                                                    {' '}
                                                    <FontAwesomeIcon icon={faUser} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    id="first_name"
                                                    placeholder="First Name"
                                                    autoComplete="given-name"
                                                    //     value={formData.first_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </CInputGroup>
                                        </CCol>
                                        <CCol md={6} className="mb-3">
                                            <CInputGroup>
                                                <CInputGroupText>
                                                    {' '}
                                                    <FontAwesomeIcon icon={faUser} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    id="last_name"
                                                    placeholder="Last Name"
                                                    autoComplete="family-name"
                                                    //     value={formData.last_name}
                                                    onChange={handleInputChange}
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
                                            // value={formData.password}
                                            onChange={handleInputChange}
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
                                            //   value={formData.repeat_password}
                                            onChange={handleInputChange}
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
                                                className="me-2 rounded border-2 border-primary text-primary"
                                                onClick={() => navigate(`/login${url}`)}
                                            >
                                                Login
                                            </CButton>
                                        </CButtonGroup>
                                    </div>
                                    <div className="d-flex justify-content-center mb-3">
                                        <GoogleLogin
                                            onSuccess={(credentialResponse) => {
                                                handleSubmit(
                                                    null,
                                                    'google',
                                                    credentialResponse.credential,
                                                )
                                            }}
                                            onError={() => {
                                                setError({
                                                    error: true,
                                                    message: 'Login Failed',
                                                })
                                            }}
                                            useOneTap
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center mb-3">
                                        <CButton
                                            color="secondary"
                                            className="d-block"
                                            size="sm"
                                            onClick={() =>
                                                (window.location.href = `https://github.com/login/oauth/authorize?client_id=${VITE_APP_GITHUB_OAUTH_CLIENT_ID}`)
                                            }
                                        >
                                            <FontAwesomeIcon icon={faGithub} /> Signup using Github
                                        </CButton>
                                    </div>
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

export default Register
