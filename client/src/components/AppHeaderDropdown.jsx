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
import { VITE_APP_AWS_S3 } from '../config.js'

const AppHeaderDropdown = () => {
    const navigate = useNavigate()
    const { user } = useUserProvider()

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : ''
    }

    return (
        <CDropdown variant="nav-item" className="app-header-dropdown">
            <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
                {user.avatar ? (
                    <CImage
                        crossOrigin="Anonymous"
                        src={`${VITE_APP_AWS_S3}/images/${user.avatar}.png`}
                        className="rounded-5 rounded-pill border p-1"
                        fluid
                        width="40px"
                        height="40px"
                        loading="lazy"
                        alt="User Avatar"
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
                            src={`${VITE_APP_AWS_S3}/images/${user.avatar}.png`}
                            className="rounded-pill border p-1 mb-2"
                            width="60px"
                            height="60px"
                            fluid
                            loading="lazy"
                            alt="User Avatar"
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
                    My Account
                </CDropdownItem>
                {['user', 'super_admin'].includes(user.role) && (
                    <CDropdownItem onClick={() => navigate('/my-addresses')}>
                        <FontAwesomeIcon icon={faAddressBook} className="me-2" />
                        My Addresses
                    </CDropdownItem>
                )}
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
