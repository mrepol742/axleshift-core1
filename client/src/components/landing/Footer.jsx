import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CContainer } from '@coreui/react'

const Footer = () => {
    const navigate = useNavigate()

    return (
        <CContainer fluid>
            <footer className="p-2 p-md-5 ">
                <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
                    <p>Axleshift © {new Date().getFullYear()}</p>
                    <ul className="list-unstyled d-flex">
                        <li className="ms-3">
                            <span
                                className="link-body-emphasis"
                                onClick={() => navigate('/privacy-policy')}
                            >
                                Privacy Policy
                            </span>
                        </li>
                        <li className="ms-3">
                            <span
                                className="link-body-emphasis"
                                onClick={() => navigate('/terms-of-service')}
                            >
                                Terms of Service
                            </span>
                        </li>
                    </ul>
                </div>
            </footer>
        </CContainer>
    )
}

export default Footer
