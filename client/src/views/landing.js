import React, { useState, useEffect } from 'react'
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
    CSpinner,
} from '@coreui/react'
import AOS from 'aos'
import 'aos/dist/aos.css'

import { Navbar, Services, About, Team, Newsletter, Footer } from '../components/landing/index'

const Landing = () => {
    AOS.init()
    const [loading, setLoading] = useState(false)
    const images = [
        '/images/freight-land.jpg',
        '/images/freight-sea.jpg',
        '/images/freight-air.jpg',
    ]

    const [backgroundImage, setBackgroundImage] = useState('')

    useEffect(() => {
        const randomImage = () => {
            const randomIndex = Math.floor(Math.random() * images.length)
            setBackgroundImage(images[randomIndex])
        }

        randomImage()
    }, [])

    return (
        <div className="wrapper d-flex flex-column min-vh-100">
            <div className="body flex-grow-1">
                {loading && (
                    <div className="loading-overlay">
                        <CSpinner color="primary" variant="grow" />
                    </div>
                )}
                <div
                    className="landing-page"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                >
                    <CContainer fluid className="h-100">
                        <Navbar />
                        <CRow className="h-100 justify-content-start align-items-center">
                            <CCol xs={12} md={6} className="px-4 mx-0 mx-md-4">
                                <h1
                                    className="display-4 text-white"
                                    data-aos="fade-right"
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
                                    data-aos="fade-down"
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
                <Newsletter setLoading={setLoading} />

                <CContainer fluid className="h-100 text-center bg-secondary p-5" data-aos="fade-up">
                    <div className="mt-5" />
                    <h1 className="text-white">SPECIAL THANKS TO</h1>
                    <p className="lead text-white">We cant do it without you as our inspiration.</p>
                    <h1 className="text-white">Beyoncé</h1>
                    <div className="mb-5" />
                </CContainer>

                <Footer />
            </div>
        </div>
    )
}

export default Landing
