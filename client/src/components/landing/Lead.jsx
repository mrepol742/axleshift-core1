import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { CContainer, CRow, CCol, CButton, CSpinner } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import Navbar from './Navbar'

const Lead = () => {
    const navigate = useNavigate()

    return (
        <CContainer
            fluid
            className="vh-100 d-flex flex-column overflow-auto position-relative bg-dark"
        >
            <div className="auth-bg position-absolute top-0 start-0 w-100 h-100" />
            <Navbar />
            <CRow className="flex-grow-1 justify-content-center align-items-center">
                <CCol xs={12} md={8} xl={6} className="px-4 mx-0 mx-md-4 text-center">
                    <h1 className="text-white display-4 fw-bold" data-aos="fade-right">
                        Your Shippment
                        <span className="text-primary d-block">Our Platform</span>
                    </h1>
                    <p className="text-white fs-5" data-aos="fade-right">
                        Connecting businesses with smarter, faster, and more secure shipping. From
                        first mile to last, we move your world forward.
                    </p>
                    <CButton
                        to="/register"
                        as={NavLink}
                        className="rounded-3 btn-primary text-white py-2 me-2"
                        data-aos="fade-up"
                    >
                        Get Started <FontAwesomeIcon icon={faArrowRightLong} />
                    </CButton>
                </CCol>
            </CRow>
        </CContainer>
    )
}

export default Lead
