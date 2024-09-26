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
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'

const Login = () => {
    const navigate = useNavigate()
    const recaptchaRef = React.useRef()

    const forgotPassword = () => {
        navigate('/forgot-password')
    }

    useEffect(() => {
        if (Cookies.get('RCTSESSION') !== undefined) navigate('/')
    }, [])

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const recaptcha = await recaptchaRef.current.executeAsync()

        try {
            const formData = new FormData()
            formData.append('email', email)
            formData.append('password', password)
            formData.append('recaptchaRef', recaptcha)

            const response = await axios.post('http://localhost:5050/api/auth/login', formData, {
                headers: {},
            })
            const status = response.data.status
            if (status == 200) {
                Cookies.set('RCTSESSION', response.data.token)
                const urlParams = new URLSearchParams(window.location.search)
                let url = '/'
                if (urlParams.has('n')) {
                    url = urlParams.get('n')
                }
                navigate(url)
            } else {
                alert(status)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
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
                                        sitekey="6LcbAQopAAAAAPqiUSbgE4FWJrHdKfpFIK_s6rU-"
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
                                    <CRow>
                                        <CCol xs={6}>
                                            <CButton type="submit" color="primary" className="px-4">
                                                Login
                                            </CButton>
                                        </CCol>
                                        <CCol xs={6} className="text-right">
                                            <CButton
                                                color="link"
                                                className="px-0"
                                                onClick={forgotPassword}
                                            >
                                                Forgot password?
                                            </CButton>
                                        </CCol>
                                    </CRow>
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
