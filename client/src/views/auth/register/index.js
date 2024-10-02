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
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons'
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
        if (formData.password !== formData.repeat_password) return alert('Passwords do not match')

        const recaptcha = await recaptchaRef.current.executeAsync()
        //TODO: this thing doesnt not yet work i dont know why?
        setFormData((prev) => ({
            ...prev,
            recaptcha_ref: recaptcha,
        }))

        try {
            const formDataToSend = new FormData()

            for (const key in formData) {
                formDataToSend.append(key, formData[key])
            }

            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_URL}/api/auth/register`,
                formDataToSend,
                {
                    headers: {},
                },
            )
            const status = response.data.status
            if (status == 201) return navigate('/')
            alert(status)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8} lg={6} xl={5}>
                        <CCard className="mx-4">
                            <CCardBody className="p-4">
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
