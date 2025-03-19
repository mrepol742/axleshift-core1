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
import { faArrowRightFromBracket, faShield, faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { useUserProvider } from '../components/UserProvider'
import { VITE_APP_API_URL } from '../config.js'

const AppHeaderDropdown = () => {
    const navigate = useNavigate()
    const { user } = useUserProvider()

    return (
        <CDropdown variant="nav-item">
            <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
                <CImage
                    crossOrigin="Anonymous"
                    src={
                        user.ref
                            ? `${VITE_APP_API_URL}/u/${user.ref}.png`
                            : '/images/default-avatar.jpg'
                    }
                    className="rounded-5"
                    fluid
                    width="40px"
                    height="40px"
                    loading="lazy"
                />
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
                <CDropdownHeader className="bg-body-secondary fw-semibold text-center">
                    <CImage
                        crossOrigin="Anonymous"
                        src={
                            user.ref
                                ? `${VITE_APP_API_URL}/u/${user.ref}.png`
                                : '/images/default-avatar.jpg'
                        }
                        className="rounded mb-2"
                        fluid
                        width="70px"
                        height="70px"
                        loading="lazy"
                    />
                    <div>
                        <span className="d-block text-truncate" style={{ maxWidth: '200px' }}>
                            {user.first_name} {user.last_name}
                        </span>
                        <span className="text-truncate" style={{ maxWidth: '200px' }}>
                            {user.email}
                        </span>
                    </div>
                </CDropdownHeader>
                <CDropdownItem onClick={() => navigate('/account')}>
                    <FontAwesomeIcon icon={faCircleUser} className="me-2" />
                    Account
                </CDropdownItem>
                <CDropdownItem onClick={() => navigate('/account/security')}>
                    <FontAwesomeIcon icon={faShield} className="me-2" />
                    Security
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
