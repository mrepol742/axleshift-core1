import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { CContainer, CRow, CCol, CButton, CSpinner } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import Navbar from './Navbar'

const Lead = () => {
    const navigate = useNavigate()

    return (
        <CContainer fluid className="vh-100 d-flex flex-column overflow-auto position-relative">
            <div className="auth-bg position-absolute top-0 start-0 w-100 h-100" />
            <Navbar />
            <CRow className="flex-grow-1 justify-content-center align-items-center">
                <CCol xs={12} md={6} className="px-4 mx-0 mx-md-4 text-center">
                    <h1 className="text-white" data-aos="fade-right">
                        Where <span className="text-primary">Freight</span> Meets Efficiency
                    </h1>
                    <p className="text-white" data-aos="fade-right">
                        Our cutting-edge platform empowers businesses to improve their shipping
                        strategies. Experience optimized routing without the complexities of
                        tracking.
                    </p>
                    <CButton
                        to="/register"
                        as={NavLink}
                        className="rounded-3 btn-primary text-white"
                        data-aos="fade-up"
                    >
                        Get started <FontAwesomeIcon icon={faArrowRightLong} />
                    </CButton>
                </CCol>
            </CRow>
        </CContainer>
    )
}

export default Lead
