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

const Login = () => {
    const navigate = useNavigate()

    useEffect(() => {
        if (Cookies.get('RCTSESSION') !== undefined) navigate('/')
    }, [])

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('email', email)
            formData.append('password', password)

            const response = await axios.post('http://localhost:5050/api/auth/login', formData, {
                headers: {},
            })
            const status = response.data.status
            if (status == 200) {
                Cookies.set('RCTSESSION', response.data.token)
                window.location.href = '/'
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
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <FontAwesomeIcon icon={faEnvelope} />
                                        </CInputGroupText>
                                        <CFormInput
                                            placeholder="Email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
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
                                                href="/forgot-password"
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
