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

const Footer = () => {
    return (
        <CContainer fluid className="bg-secondary">
            <footer className="d-flex flex-wrap justify-content-between align-items-center p-5 border-top">
                <div className="col-md-4 text-white">
                    <CImage src="/images/logo.png" fluid width="200px" alt="Axleshift Core 1" />
                    <p className="mb-3 me-2 mb-md-0">&copy; 2024 core1.axleshift.com</p>
                </div>
            </footer>
        </CContainer>
    )
}

export default Footer
