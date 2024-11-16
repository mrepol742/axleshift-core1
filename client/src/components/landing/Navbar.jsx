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

const Navbar = () => {
    const [visible, setVisible] = useState(false)
    const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

    return (
        <CNavbar expand="sm" colorScheme={colorMode} className="fixed-top p-navbar">
            <CContainer fluid>
                <CNavbarToggler
                    aria-label="Toggle navigation"
                    aria-expanded={visible}
                    onClick={() => setVisible(!visible)}
                />
                <CNavbarBrand to="/" as={NavLink} className="d-none d-sm-block">
                    <CImage src="/images/logo.png" width="150px" />
                </CNavbarBrand>
                <CNavbarNav>
                    <CNavItem>
                        <CNavLink
                            to="/register"
                            as={NavLink}
                            className="bg-warning rounded px-3 text-white d-block d-sm-none"
                        >
                            Register
                        </CNavLink>
                    </CNavItem>
                </CNavbarNav>
                <CCollapse className="navbar-collapse" visible={visible}>
                    <CNavbarNav className="ms-auto">
                        <CDropdown
                            variant="nav-item"
                            placement="bottom-end"
                            className="mx-2 mx-sm-0"
                        >
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
                            <CNavLink className="text-white mx-2 mx-sm-0" to="/login" as={NavLink}>
                                Login
                            </CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink
                                to="/register"
                                as={NavLink}
                                className="d-none text-white d-sm-block"
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
