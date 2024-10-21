import React from 'react'
import { CCol, CContainer, CRow } from '@coreui/react'

const Terms = () => {
    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <div className="auth-bg" />
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8} lg={9} xl={10}>
                        <h1
                            className="display-4 text-white"
                            data-aos="fade-right"
                            data-aos-duration="1000"
                        >
                            Terms of Service
                        </h1>
                        Last Updated: Mon, Oct 21 2024
                        <p className="lead text-white" data-aos="fade-up" data-aos-duration="1000">
                            By accessing or using our services, you agree to comply with these Terms
                            of Service. If you do not agree, please do not use our services.
                        </p>
                        <h3>Acceptance of Terms</h3>
                        By using our services, you accept these Terms in full. If you disagree with
                        any part of these terms, you must not use our services.
                        <h3>Modifications</h3>
                        We reserve the right to modify these Terms at any time. We will notify you
                        of any changes by posting the new Terms on this page. Your continued use of
                        the services after any changes indicates your acceptance of the new Terms.
                        <h3> User Responsibilities</h3>
                        You are responsible for maintaining the confidentiality of your account
                        information. You agree to use our services only for lawful purposes and in
                        accordance with these Terms.
                        <h3> Intellectual Property </h3>
                        All content, features, and functionality are the exclusive property of
                        Axleshift Core 1 and are protected by copyright, trademark, and other
                        intellectual property laws.
                        <h3>Limitation of Liability</h3>
                        Axleshift Core 1 shall not be liable for any direct, indirect, incidental,
                        or consequential damages arising from your use of our services.
                        <h3>Governing Law</h3>
                        These Terms shall be governed by and construed in accordance with the laws
                        of the Philippines.
                        <h3> Contact Information</h3>
                        For any questions about these Terms, please contact us at
                        mrepol742@gmail.com.
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default Terms
