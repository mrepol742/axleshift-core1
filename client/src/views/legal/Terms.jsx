import React from 'react'
import { CCol, CContainer, CRow } from '@coreui/react'
import Navbar from './Nav'
import Footer from './Footer'

const Terms = () => {
    return (
        <>
            <Navbar />
            <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={8} lg={9} xl={10}>
                            <h1 className="display-4 text-primary fw-medium mt-5">
                                Terms of Service
                            </h1>
                            <p className="text-muted">
                                By accessing or using our services, you agree to comply with these
                                Terms of Service. If you do not agree, please do not use our
                                services.
                                <br />
                                Last Updated: Mon, Oct 21 2024
                            </p>
                            <div className="mb-3">
                                <h3>Acceptance of Terms</h3>
                                By using our services, you accept these Terms in full. If you
                                disagree with any part of these terms, you must not use our
                                services.
                            </div>
                            <div className="mb-3">
                                <h3>Modifications</h3>
                                We reserve the right to modify these Terms at any time. We will
                                notify you of any changes by posting the new Terms on this page.
                                Your continued use of the services after any changes indicates your
                                acceptance of the new Terms.
                            </div>
                            <div className="mb-3">
                                <h3> User Responsibilities</h3>
                                You are responsible for maintaining the confidentiality of your
                                account login credentials and informations. You agree to use our
                                services only for lawful purposes and in accordance with these
                                Terms.
                            </div>
                            <div className="mb-3">
                                <h3> Intellectual Property </h3>
                                All content, features, and functionality are the exclusive property
                                of Axleshift and are protected by copyright and other intellectual
                                property laws. All third-party trademarks, service marks, and logos
                                used in our services are the trademarks, service marks, or logos of
                                their respective owners.
                            </div>
                            <div className="mb-3">
                                <h3>Limitation of Liability</h3>
                                Axleshift or any of its respective parents, affiliates, successors,
                                assigns, employees, agents, directors, developers, officers and
                                shareholders, shall not be liable for any direct, indirect,
                                incidental, or consequential damages arising from your use of our
                                services.
                            </div>
                            <div className="mb-3">
                                <h3>Governing Law</h3>
                                These Terms shall be governed by and construed in accordance with
                                the laws of the Philippines.
                            </div>
                            <div className="mb-3">
                                <h3> Contact Information</h3>
                                For any questions about these Terms, please contact us at
                                mrepol742@gmail.com.
                            </div>
                        </CCol>
                    </CRow>
                </CContainer>
            </div>
            <Footer />
        </>
    )
}

export default Terms
