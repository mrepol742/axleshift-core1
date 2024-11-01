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
                                <h1 className="text-white display-1" style={{ fontWeight: 400 }}>
                                    Where <span className="text-warning">Freight</span> Meets
                                    Efficiency
                                </h1>
                                <p className="lead text-white">
                                    Our cutting-edge platform empowers businesses to improve their
                                    shipping strategies. Experience optimized routing without the
                                    complexities of tracking.
                                </p>
                                <CButton
                                    to="/register"
                                    as={NavLink}
                                    className="rounded-3 btn-warning px-5 py-3"
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

                <CContainer
                    fluid
                    className="h-100 text-center bg-secondary p-5 shadow"
                    data-aos="fade-up"
                >
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
