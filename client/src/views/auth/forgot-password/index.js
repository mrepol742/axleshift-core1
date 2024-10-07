import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'
import ReCAPTCHA from 'react-google-recaptcha'
import background from '../../../assets/brand/background.png'

const Login = () => {
    const VITE_APP_RECAPTCHA_SITE_KEY = import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY
    const navigate = useNavigate()
    const recaptchaRef = React.useRef()

    useEffect(() => {
        if (Cookies.get(import.meta.env.VITE_APP_SESSION) !== undefined) return navigate('/')
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = await recaptchaRef.current.executeAsync()
    }

    const backgroundStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.5,
    }

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <div style={backgroundStyle} />
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8} lg={6} xl={5}>
                        <CCard className="p-1 p-md-4">
                            <CCardBody>
                                <CForm onSubmit={handleSubmit}>
                                    <h1>Forgot Password</h1>
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
                                            required
                                        />
                                    </CInputGroup>
                                    <div className="d-grid">
                                        <CButtonGroup>
                                            <CButton
                                                type="submit"
                                                color="success"
                                                className="me-2 rounded"
                                            >
                                                Submit
                                            </CButton>
                                            <CButton
                                                color="primary"
                                                className="me-2 rounded"
                                                onClick={() => navigate('/login')}
                                            >
                                                Login
                                            </CButton>
                                        </CButtonGroup>
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

export default Login
