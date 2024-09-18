import React from 'react'
import { Link } from 'react-router-dom'
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
    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8} lg={6} xl={5}>
                        <CCard className="p-4">
                            <CCardBody>
                                <CForm>
                                    <h1>Forgot Password</h1>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <FontAwesomeIcon icon={faEnvelope} />
                                        </CInputGroupText>
                                        <CFormInput placeholder="Email" autoComplete="email" />
                                    </CInputGroup>
                                    <CRow>
                                        <CCol xs={6}>
                                            <CButton color="primary" className="px-4">
                                                Submit
                                            </CButton>
                                        </CCol>
                                        <CCol xs={6} className="text-right">
                                            <CButton color="link" className="px-0" href="/login">
                                                Login
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
