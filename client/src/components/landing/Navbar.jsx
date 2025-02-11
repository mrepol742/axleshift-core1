import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
    CNavbar,
    CContainer,
    CNavbarToggler,
    CCollapse,
    CNavbarNav,
    CNavItem,
    CNavLink,
    CNavbarBrand,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    useColorModes,
    CImage,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun, faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
    const [visible, setVisible] = useState(false)
    const { colorMode, setColorMode } = useColorModes('theme')

    return (
        <CNavbar
            expand={false}
            colorScheme={colorMode}
            className="fixed-top p-3"
            style={{
                background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0))',
            }}
        >
            <CContainer
                fluid
                className="position-relative d-flex justify-content-between align-items-center"
            >
                {/* Right Side - Navigation (Floating) */}
                <div className="position-absolute top-0 end-0 mt-2 me-3 d-flex align-items-center">
                    <CDropdown placement="bottom-end" className="px-3 mx-sm-0">
                        <CDropdownToggle caret={false} className="text-white">
                            {colorMode === 'dark' ? (
                                <FontAwesomeIcon icon={faMoon} />
                            ) : colorMode === 'auto' ? (
                                <FontAwesomeIcon icon={faCircleHalfStroke} />
                            ) : (
                                <FontAwesomeIcon icon={faSun} />
                            )}
                        </CDropdownToggle>
                        <CDropdownMenu>
                            <CDropdownItem
                                active={colorMode === 'light'}
                                className="d-flex align-items-center"
                                as="button"
                                type="button"
                                onClick={() => setColorMode('light')}
                            >
                                <FontAwesomeIcon className="me-2" icon={faSun} /> Light
                            </CDropdownItem>
                            <CDropdownItem
                                active={colorMode === 'dark'}
                                className="d-flex align-items-center"
                                as="button"
                                type="button"
                                onClick={() => setColorMode('dark')}
                            >
                                <FontAwesomeIcon className="me-2" icon={faMoon} /> Dark
                            </CDropdownItem>
                            <CDropdownItem
                                active={colorMode === 'auto'}
                                className="d-flex align-items-center"
                                as="button"
                                type="button"
                                onClick={() => setColorMode('auto')}
                            >
                                <FontAwesomeIcon className="me-2" icon={faCircleHalfStroke} /> Auto
                            </CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                    <CNavLink
                        className="text-white mx-2 py-1 bg-primary px-4 rounded-pill"
                        to="/login"
                        as={NavLink}
                    >
                        Login
                    </CNavLink>
                </div>

                {/* Left Side - Logo */}
                <CNavbarBrand to="/" as={NavLink} className="me-auto">
                    <CImage
                        src="/images/logo.png"
                        className="img-fluid"
                        style={{ maxWidth: '160px', height: 'auto' }}
                        loading="lazy"
                    />
                </CNavbarBrand>
            </CContainer>
        </CNavbar>
    )
}

export default Navbar
