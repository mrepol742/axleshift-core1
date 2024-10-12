import React from 'react'
import { CContainer, CRow, CCol, CImage } from '@coreui/react'

const About = () => {
    return (
        <CContainer fluid className="h-100 p-5 bg-primary" data-aos="fade-up">
            <CRow className="h-100 justify-content-start align-items-center">
                <CCol xs={12} md={5} className="mb-4" data-aos="zoom-in">
                    <CImage fluid src="/images/about.svg" />
                </CCol>
                <CCol xs={12} md={7} lg={6} xl={5} className="mb-4 p-2">
                    <span className="text-white" data-aos="zoom-out-up">
                        ABOUT US
                    </span>
                    <h1 className="text-white" data-aos="zoom-out-up">
                        Axleshift Core 1
                    </h1>
                    <p className="lead text-white" data-aos="zoom-out-up">
                        We focus on enhancing the safety and efficiency of freight management
                        systems. Our innovative solutions integrate advanced cybersecurity measures
                        to protect sensitive data while providing efficient and better freight
                        services. By leveraging cutting-edge technology, we ensure that businesses
                        can confidently manage their freight operations in an increasingly complex
                        digital landscape.
                    </p>
                </CCol>
            </CRow>
        </CContainer>
    )
}

export default About
