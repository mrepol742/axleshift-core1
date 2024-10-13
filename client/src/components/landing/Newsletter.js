import React, { useState } from 'react'
import {
    CContainer,
    CRow,
    CCol,
    CImage,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faEnvelope } from '@fortawesome/free-solid-svg-icons'

const Newsletter = () => {
    const [emailAddress, setEmailAddress] = useState('')

    return (
        <CContainer fluid className="h-100" data-aos="fade-up">
            <div className="bg-primary m-2 m-md-5">
                <CRow className="h-100 justify-content-start align-items-center p-5">
                    <CCol xs={12} md={7} lg={6} xl={5} className="mb-4 p-2" data-aos="zoom-in-down">
                        <h1 className="text-white">Newsletter - Stay tune</h1>
                        <p className="lead text-white">
                            We will email you about our products newest updates.
                        </p>
                        <CForm>
                            <CInputGroup className="mb-3">
                                <CFormInput
                                    aria-describedby="basic-addon"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                />
                                <CInputGroupText id="basic-addon" type="submit">
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </CInputGroupText>
                            </CInputGroup>
                        </CForm>
                    </CCol>
                    <CCol xs={12} md={5} className="mb-4 p-2 text-center" data-aos="zoom-in-left">
                        <FontAwesomeIcon icon={faEnvelope} className="fa-8x" />
                    </CCol>
                </CRow>
            </div>
        </CContainer>
    )
}

export default Newsletter
