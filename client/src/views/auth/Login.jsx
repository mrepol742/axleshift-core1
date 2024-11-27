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
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
} from '@coreui/react'
import { useGoogleLogin } from '@react-oauth/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEnvelope,
    faLock,
    faXmark,
    faQrcode,
    faEye,
    faEyeSlash,
} from '@fortawesome/free-solid-svg-icons'
import { faGithub, faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import { QRCodeSVG } from 'qrcode.react'
import ReCAPTCHA from 'react-google-recaptcha'
import {
    VITE_APP_RECAPTCHA_SITE_KEY,
    VITE_APP_SESSION,
    VITE_APP_GITHUB_OAUTH_CLIENT_ID,
} from '../../config'
import errorMessages from '../../utils/ErrorMessages'
import generateUUID from '../../utils/UUID'

const Login = () => {
    const navigate = useNavigate()
    const recaptchaRef = React.useRef()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(true)
    const [showQR, setShowQR] = useState(false)
    const [error, setError] = useState({
        error: false,
        message: '',
    })
    const svgRef = React.useRef(null)
    const urlParams = new URLSearchParams(window.location.search)
    const url = urlParams.get('n') ? urlParams.get('n') : '/'
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

    const getUUID = () => {
        const _uuid = cookies.get('uuid')
        const uuid = _uuid ? _uuid : generateUUID()
        if (!_uuid) cookies.set('uuid', uuid, { expires: 30 })
        return uuid
    }

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
                message: 'Server is offline or restarting please wait',
            })
            return
        }
        formData.append('type', type)
        formData.append('recaptcha_ref', recaptcha)

        axios
            .post(`/auth/login`, formData, {
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
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'

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
                {showQR && !loading && (
                    <CModal
                        visible={true}
                        onClose={() => setShowQR(false)}
                        alignment="center"
                        scrollable
                    >
                        <CModalHeader closeButton></CModalHeader>
                        <CModalBody>
                            <div
                                className="d-flex justify-content-center align-items-center"
                                ref={svgRef}
                            >
                                <QRCodeSVG
                                    value={() => getUUID()}
                                    className="border border-4 rounded-2"
                                />
                            </div>
                        </CModalBody>
                        <CModalFooter className="px-4">
                            Open Axleshift App and go to Settings &gt; Account &gt; Login using
                            QRCode
                        </CModalFooter>
                    </CModal>
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
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
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
                                        <CButton className="me-2" onClick={(e) => setShowQR(true)}>
                                            Login using <FontAwesomeIcon icon={faQrcode} /> QRCode
                                        </CButton>
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
                                        <CButton color="outline-primary" className="me-2" disabled>
                                            <FontAwesomeIcon icon={faMicrosoft} />
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
