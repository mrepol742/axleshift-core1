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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faUser, faXmark } from '@fortawesome/free-solid-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'
import Cookies from 'js-cookie'
import axios from 'axios'

const Register = () => {
    const VITE_APP_RECAPTCHA_SITE_KEY = import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY
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
    const [error, setError] = useState({
        error: false,
        message: '',
    })
    const errorMessages = {
        401: 'You failed the robot test',
        429: 'Too many attempts',
        409: 'Email is already registered',
        500: 'Internal server error',
    }

    useEffect(() => {
        if (Cookies.get(import.meta.env.VITE_APP_SESSION) !== undefined) navigate('/')
    }, [])

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()

        const formDataToSend = new FormData()
        for (const key in formData) {
            formDataToSend.append(key, formData[key])
        }
        formDataToSend.append('recaptcha_ref', recaptcha)

        await axios
            .post(`${import.meta.env.VITE_APP_API_URL}/api/v1/auth/register`, formDataToSend, {
                headers: {},
            })
            .then((response) => {
                setLoading(false)
                if (!response.data.error) navigate('/login')
                setError({
                    error: true,
                    message: response.data.error,
                })
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
                        <CCard className="mx-4">
                            <CCardBody className="p-4">
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
                                <CForm onSubmit={handleSubmit}>
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
                                            placeholder="Email"
                                            autoComplete="email"
                                            //          value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </CInputGroup>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
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
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
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
                                    <CInputGroup className="mb-4">
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
                                    <div className="d-grid">
                                        <CButtonGroup>
                                            <CButton
                                                type="submit"
                                                color="success"
                                                className="me-2 rounded"
                                            >
                                                Create Account
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
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default Register
