import React from 'react'
import { CContainer, CRow, CCol, CImage, CForm, CFormInput } from '@coreui/react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Newsletter = () => {
    AOS.init()

    return (
        <CContainer fluid className="h-100" data-aos="fade-up">
            <div className="bg-primary m-2 m-md-5">
                <CRow className="h-100 justify-content-start align-items-center p-5">
                    <CCol xs={12} md={7} lg={6} xl={5} className="mb-4 p-2" data-aos="zoom-in-down">
                        <h1 className="text-white">Newsletter - Stay tune</h1>
                        <p className="lead text-white">
                            We will email you about our products newest updates.
                        </p>
                    </CCol>
                    <CCol xs={12} md={5} className="mb-4 p-2" data-aos="zoom-in-left">
                        <CForm>
                            <CFormInput
                                type="email"
                                label="Email address"
                                placeholder="name@example.com"
                            />
                        </CForm>
                    </CCol>
                </CRow>
            </div>
        </CContainer>
    )
}

export default Newsletter
