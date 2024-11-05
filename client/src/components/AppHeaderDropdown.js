import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CImage,
    CAvatar,
    CBadge,
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
    faBell,
} from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import Profile from '../components/Profile'
import { VITE_APP_API_URL } from '../config.js'

const AppHeaderDropdown = () => {
    const navigate = useNavigate()
    const user = Profile()

    return (
        <CDropdown variant="nav-item">
            <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
                <CImage
                    crossOrigin="Anonymous"
                    src={`${VITE_APP_API_URL}/u/${user.ref}.png`}
                    className="rounded-5"
                    fluid
                    width="40px"
                />
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
                <CDropdownHeader className="bg-body-secondary fw-semibold mb-2 fs-6 px-5">
                    {user.first_name} {user.last_name}
                </CDropdownHeader>
                <CDropdownItem onClick={() => navigate('/account')}>
                    <FontAwesomeIcon icon={faCircleUser} className="me-2" />
                    Account
                </CDropdownItem>
                <CDropdownItem onClick={() => navigate('/account/security')}>
                    <FontAwesomeIcon icon={faShield} className="me-2" />
                    Security
                </CDropdownItem>
                <CDropdownItem onClick={() => navigate('/account/notifications')}>
                    <FontAwesomeIcon icon={faBell} className="me-2" />
                    Notifications
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
