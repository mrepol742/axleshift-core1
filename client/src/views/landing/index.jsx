import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
    CContainer,
    CRow,
    CCol,
    CButton,
    CSpinner,
    CCard,
    CCardBody,
    CCardTitle,
    CCardText,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import { Lead, Services, About, Team, Newsletter, Footer } from '../../components/landing/index'
import { VITE_APP_SESSION } from '../../config'

const Landing = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const modules = [
        {
            name: 'ADMIN',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            url: 'https://admin.axleshift.com',
        },
        {
            name: 'CORE 1',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            url: 'https://core1.axleshift.com',
        },
        {
            name: 'CORE 2',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            url: 'https://core2.axleshift.com',
        },
        {
            name: 'FINANCE',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            url: 'https://finance.axleshift.com',
        },
        {
            name: 'HR 1',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            url: 'https://hr1.axleshift.com',
        },
        {
            name: 'HR 2',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            url: 'https://hr2.axleshift.com',
        },
        {
            name: 'HR 3',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            url: 'https://hr3.axleshift.com',
        },
        {
            name: 'HR 4',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            url: 'https://hr4.axleshift.com',
        },
        {
            name: 'LOG 1',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            url: 'https://log1.axleshift.com',
        },
        {
            name: 'LOG 2',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            url: 'https://log2.axleshift.com',
        },
    ]

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
                <div className="h-100">
                    <CContainer className="pt-5">
                        <div className="mb-2" data-aos="fade-down">
                            <span>MODULES</span>
                            <h2 className="text-primary">
                                Without them, there&apos;s no axleshift!
                            </h2>
                        </div>
                        <CRow>
                            {modules.map((module, index) => {
                                return (
                                    <CCol sm={4} key={index}>
                                        <CCard
                                            className="mb-4 border-0 rounded-0 module-card"
                                            data-aos="fade-up"
                                            style={{ transition: 'transform 0.3s ease' }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.05)'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)'
                                            }}
                                        >
                                            <CCardBody>
                                                <CCardTitle data-aos="fade-up" data-aos-delay="500">
                                                    {module.name}
                                                </CCardTitle>
                                                <CCardText
                                                    className="text-muted"
                                                    data-aos="fade-up"
                                                    data-aos-delay="800"
                                                >
                                                    {module.description}
                                                </CCardText>
                                                <div className="d-flex justify-content-end">
                                                    <CButton
                                                        href={module.url}
                                                        className="rounded-pill bg-primary bg-opacity-25 text-primary"
                                                        data-aos="fade-right"
                                                        data-aos-delay="1000"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faChevronRight}
                                                            className="p-1"
                                                        />
                                                    </CButton>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                )
                            })}
                        </CRow>
                    </CContainer>
                </div>
                <Team />
                <Newsletter setLoading={setLoading} />
                <Footer />
            </div>
        </div>
    )
}

export default Landing
