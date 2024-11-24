import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
    CContainer,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CHeader,
    CHeaderNav,
    CHeaderToggler,
    CNavLink,
    CNavItem,
    useColorModes,
    CForm,
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CButton,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBars,
    faBell,
    faMoon,
    faSun,
    faCircleHalfStroke,
    faMagnifyingGlass,
    faCalendarDays,
    faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { AppBreadcrumb, AppHeaderDropdown } from './index'
import AppNotifcationDropdown from './AppNotificationDropdown'
import AppSearch from './AppSearch'

const AppHeader = () => {
    const headerRef = useRef()
    const { colorMode, setColorMode } = useColorModes('theme')
    const dispatch = useDispatch()
    const sidebarShow = useSelector((state) => state.sidebarShow)
    const navigate = useNavigate()

    useEffect(() => {
        document.addEventListener('scroll', () => {
            headerRef.current &&
                headerRef.current.classList.toggle(
                    'shadow-sm',
                    document.documentElement.scrollTop > 0,
                )
        })
    }, [])

    return (
        <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
            <CContainer className="border-bottom px-4" fluid>
                <CHeaderToggler
                    onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
                    style={{ marginInlineStart: '-14px' }}
                >
                    <FontAwesomeIcon icon={faBars} />
                </CHeaderToggler>
                <CHeaderNav>
                    <CNavItem>
                        <CButton onClick={(e) => navigate('/freight')}>
                            <FontAwesomeIcon icon={faPlus} />
                        </CButton>
                    </CNavItem>
                    <CNavItem>
                        <CButton onClick={(e) => navigate('/schedules')}>
                            <FontAwesomeIcon icon={faCalendarDays} />
                        </CButton>
                    </CNavItem>
                    <AppSearch className="mx-auto d-none d-md-flex" />
                </CHeaderNav>
                <CHeaderNav className="ms-auto px-2">
                    <AppNotifcationDropdown />
                </CHeaderNav>
                <CHeaderNav>
                    <CDropdown variant="nav-item" placement="bottom-end">
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
                                <FontAwesomeIcon className="me-2" icon={faMoon} size="lg" /> Dark
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
                    <AppHeaderDropdown />
                </CHeaderNav>
            </CContainer>
            <CContainer className="px-4" fluid>
                <AppBreadcrumb />
            </CContainer>
        </CHeader>
    )
}

export default AppHeader
