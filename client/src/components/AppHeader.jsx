import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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
    CNavItem,
    useColorModes,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBars,
    faMoon,
    faSun,
    faCircleHalfStroke,
    faCalendarDays,
    faPlus,
    faSearch,
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
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        document.addEventListener('scroll', () => {
            headerRef.current &&
                headerRef.current.classList.toggle(
                    'shadow-sm',
                    document.documentElement.scrollTop > 0,
                )
        })
    }, [])

    const setTheme = (theme) => {
        dispatch({ type: 'set', theme: theme })
        setColorMode(theme)
    }

    return (
        <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
            <CContainer className="border-bottom px-3 px-md-4" fluid>
                <CHeaderToggler
                    onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
                    style={{ marginInlineStart: '-14px' }}
                >
                    <FontAwesomeIcon icon={faBars} />
                </CHeaderToggler>
                <CHeaderNav>
                    <CNavItem className="schedules-calendar">
                        <CButton onClick={(e) => navigate('/schedules')}>
                            <FontAwesomeIcon icon={faCalendarDays} />
                        </CButton>
                    </CNavItem>
                </CHeaderNav>
                <CHeaderNav className="ms-auto px-2">
                    <AppSearch className="mx-auto d-none d-md-flex me-2 search-shipment" />
                    <div
                        onClick={(e) => setModalVisible(true)}
                        className="d-block d-md-none me-2 search-shipment"
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
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
                                onClick={() => setTheme('light')}
                            >
                                <FontAwesomeIcon className="me-2" icon={faSun} /> Light
                            </CDropdownItem>
                            <CDropdownItem
                                active={colorMode === 'dark'}
                                className="d-flex align-items-center"
                                as="button"
                                type="button"
                                onClick={() => setTheme('dark')}
                            >
                                <FontAwesomeIcon className="me-2" icon={faMoon} size="lg" /> Dark
                            </CDropdownItem>
                            <CDropdownItem
                                active={colorMode === 'auto'}
                                className="d-flex align-items-center"
                                as="button"
                                type="button"
                                onClick={() => setTheme('auto')}
                            >
                                <FontAwesomeIcon className="me-2" icon={faCircleHalfStroke} /> Auto
                            </CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                    <AppHeaderDropdown className="app-header-dropdown" />
                </CHeaderNav>
            </CContainer>
            <CContainer className="px-3 px-md-4" fluid>
                <AppBreadcrumb />
            </CContainer>

            <CModal
                alignment="top"
                scrollable
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            >
                <CModalBody>
                    <AppSearch className="mx-auto me-2" />
                </CModalBody>
            </CModal>
        </CHeader>
    )
}

export default AppHeader
