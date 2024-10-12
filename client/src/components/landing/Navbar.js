import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
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
    CHeaderNav,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBars,
    faBell,
    faMoon,
    faSun,
    faCircleHalfStroke,
} from '@fortawesome/free-solid-svg-icons'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Navbar = () => {
    const [visible, setVisible] = useState(false)
    const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
    AOS.init()

    return (
        <CNavbar expand="sm" colorScheme={colorMode}>
            <CContainer fluid>
                <CNavbarBrand
                    to="/"
                    as={NavLink}
                    data-aos="fade-down-right"
                    data-aos-duration="1000"
                >
                    <CImage src="/images/logo.png" width="150px" />
                </CNavbarBrand>
                <CNavbarToggler
                    aria-label="Toggle navigation"
                    aria-expanded={visible}
                    onClick={() => setVisible(!visible)}
                />
                <CCollapse className="navbar-collapse" visible={visible}>
                    <CNavbarNav className="ms-auto">
                        <CDropdown
                            variant="nav-item"
                            placement="bottom-end"
                            data-aos="fade-down"
                            data-aos-duration="1000"
                        >
                            <CDropdownToggle caret={false}>
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
                                    <FontAwesomeIcon className="me-2" icon={faMoon} size="lg" />{' '}
                                    Dark
                                </CDropdownItem>
                                <CDropdownItem
                                    active={colorMode === 'auto'}
                                    className="d-flex align-items-center"
                                    as="button"
                                    type="button"
                                    onClick={() => setColorMode('auto')}
                                >
                                    <FontAwesomeIcon className="me-2" icon={faCircleHalfStroke} />{' '}
                                    Auto
                                </CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                        <CNavItem>
                            <CNavLink
                                to="/login"
                                as={NavLink}
                                data-aos="fade-down"
                                data-aos-duration="1000"
                            >
                                Login
                            </CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink
                                to="/register"
                                as={NavLink}
                                data-aos="fade-down"
                                data-aos-duration="1000"
                            >
                                Register
                            </CNavLink>
                        </CNavItem>
                    </CNavbarNav>
                </CCollapse>
            </CContainer>
        </CNavbar>
    )
}

export default Navbar
