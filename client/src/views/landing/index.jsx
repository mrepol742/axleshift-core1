import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { CContainer, CRow, CCol, CButton, CSpinner } from '@coreui/react'
import AOS from 'aos'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import { Lead, Services, About, Team, Newsletter, Footer } from '../../components/landing/index'
import { VITE_APP_SESSION } from '../../config'

const Landing = () => {
    AOS.init()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (cookies.get(VITE_APP_SESSION)) return navigate('/dashboard')
        setLoading(false)
    }, [])

    if (loading)
        return (
            <div className="wrapper d-flex flex-column min-vh-100">
                <div className="body flex-grow-1">
                    <div className="loading-overlay">
                        <CSpinner color="primary" variant="grow" />
                    </div>
                </div>
            </div>
        )

    return (
        <div className="wrapper d-flex flex-column min-vh-100">
            <div className="body flex-grow-1">
                <Lead />
                <Services />
                <About />
                <Team />
                <Newsletter setLoading={setLoading} />
                <Footer />
            </div>
        </div>
    )
}

export default Landing
