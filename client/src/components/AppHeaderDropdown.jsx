import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CImage,
    CDropdown,
    CDropdownDivider,
    CDropdownHeader,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowRightFromBracket,
    faShield,
    faCircleUser,
    faAddressBook,
} from '@fortawesome/free-solid-svg-icons'
import { useUserProvider } from '../components/UserProvider'
import { VITE_APP_API_URL } from '../config.js'

const AppHeaderDropdown = () => {
    const navigate = useNavigate()
    const { user } = useUserProvider()

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : ''
    }

    return (
        <CDropdown variant="nav-item">
            <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
                {user.avatar ? (
                    <CImage
                        crossOrigin="Anonymous"
                        src={`${VITE_APP_API_URL}/u/${user.avatar}.png`}
                        className="rounded-5"
                        fluid
                        width="40px"
                        height="40px"
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="rounded-pill bg-primary d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px', color: 'white' }}
                    >
                        {getInitials(user.first_name)}
                    </div>
                )}
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
                <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
                    {user.avatar ? (
                        <CImage
                            crossOrigin="Anonymous"
                            src={`${VITE_APP_API_URL}/u/${user.avatar}.png`}
                            className="rounded mb-2"
                            fluid
                            width="70px"
                            height="70px"
                            loading="lazy"
                        />
                    ) : (
                        <div
                            className="rounded-pill bg-primary d-flex align-items-center justify-content-center mb-2 fs-4"
                            style={{ width: '70px', height: '70px', color: 'white' }}
                        >
                            {getInitials(user.first_name)}
                        </div>
                    )}
                    <span className="d-block text-truncate" style={{ maxWidth: '250px' }}>
                        {user.first_name} {user.last_name}
                    </span>
                    <span className="d-block text-truncate" style={{ maxWidth: '250px' }}>
                        {user.email}
                    </span>
                </CDropdownHeader>
                <CDropdownItem onClick={() => navigate('/account')}>
                    <FontAwesomeIcon icon={faCircleUser} className="me-2" />
                    Account
                </CDropdownItem>
                <CDropdownItem onClick={() => navigate('/account/security')}>
                    <FontAwesomeIcon icon={faShield} className="me-2" />
                    Security
                </CDropdownItem>
                <CDropdownItem onClick={() => navigate('/my-addresses')}>
                    <FontAwesomeIcon icon={faAddressBook} className="me-2" />
                    My Addresses
                </CDropdownItem>
                <CDropdownDivider />
                <CDropdownItem onClick={() => navigate('/logout')}>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="me-2" />
                    Logout
                </CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    )
}

export default AppHeaderDropdown
