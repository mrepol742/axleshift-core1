import React, { useState } from 'react'
import {
    CCollapse,
    CContainer,
    CNavbar,
    CNavbarBrand,
    CNavbarNav,
    CNavbarToggler,
    CNavItem,
    CNavLink,
    CImage,
} from '@coreui/react'

const Nav = () => {
    const [visible, setVisible] = useState(false)

    return (
        <div>
            <CNavbar
                expand="md"
                style={{
                    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0))',
                }}
            >
                <CContainer fluid>
                    <CNavbarBrand href="/">
                        <CImage
                            fluid
                            src="/images/logo.png"
                            className="img-fluid"
                            width={150}
                            loading="lazy"
                        />
                    </CNavbarBrand>
                    <CNavbarToggler
                        aria-label="Toggle navigation"
                        aria-expanded={visible}
                        onClick={() => setVisible(!visible)}
                    />
                    <CCollapse className="navbar-collapse" visible={visible}>
                        <CNavbarNav className="ms-auto px-2">
                            <CNavItem>
                                <CNavLink href="/">Home</CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink href="/privacy-policy">Privacy Policy</CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink href="/terms-of-service">Terms of Service</CNavLink>
                            </CNavItem>
                        </CNavbarNav>
                    </CCollapse>
                </CContainer>
            </CNavbar>
        </div>
    )
}

export default Nav
