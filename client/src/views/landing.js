import React from 'react'
import { NavLink } from 'react-router-dom'
import {
    CNavbar,
    CNavbarBrand,
    CNavbarNav,
    CNavItem,
    CNavLink,
    CContainer,
    CRow,
    CCol,
    CButton,
} from '@coreui/react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Navbar from '../components/landing/Navbar'
import Services from '../components/landing/Services'
import About from '../components/landing/About'
import Team from '../components/landing/Team'
import Newsletter from '../components/landing/Newsletter'

const Landing = () => {
    AOS.init()
    return (
        <div className="wrapper d-flex flex-column min-vh-100">
            <div className="body flex-grow-1">
                <div className="landing-page">
                    <CContainer fluid className="h-100">
                        <Navbar />
                        <CRow className="h-100 justify-content-start align-items-center">
                            <CCol xs={12} md={6} className="px-4 mx-0 mx-md-4">
                                <h1
                                    className="display-4 text-white"
                                    data-aos="fade-up"
                                    data-aos-duration="1000"
                                >
                                    Where Freight Meets Efficiency
                                </h1>
                                <p
                                    className="lead text-white"
                                    data-aos="fade-up"
                                    data-aos-duration="1000"
                                >
                                    Our cutting-edge platform empowers businesses to improve their
                                    shipping strategies. Experience optimized routing without the
                                    complexities of tracking.
                                </p>
                                <CButton
                                    to="/register"
                                    as={NavLink}
                                    className="rounded-1 btn-warning fs-6 px-5"
                                    data-aos="fade-up"
                                    data-aos-duration="1000"
                                >
                                    Register now
                                </CButton>
                            </CCol>
                        </CRow>
                    </CContainer>
                </div>

                <Services />
                <About />
                <Team />
                <Newsletter />

                <div className="m-5">
                    <CContainer fluid className="text-center">
                        <span>Copyright &copy;2024 Axleshift Core 1</span>
                    </CContainer>
                </div>
            </div>
        </div>
    )
}

export default Landing
