import React, { useState, useEffect } from 'react'
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
    CSpinner,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_SESSION } from '../../config'
import errorMessages from '../../components/ErrorMessages'

const Login = () => {
    const navigate = useNavigate()
    const recaptchaRef = React.useRef()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (cookies.get(VITE_APP_SESSION) !== undefined) return navigate('/overview')
        setLoading(false)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = await recaptchaRef.current.executeAsync()
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
                        <CCard className="p-1 p-sm-4 shadow">
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
                                                color="primary"
                                                className="me-2 rounded"
                                            >
                                                Submit
                                            </CButton>
                                            <CButton
                                                color="outline-primary"
                                                className="me-2 rounded"
                                                onClick={() => navigate('/login')}
                                            >
                                                Login
                                            </CButton>
                                        </CButtonGroup>
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

export default Login
