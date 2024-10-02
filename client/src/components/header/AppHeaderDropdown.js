import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
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
    faShieldHalved,
    faCircleInfo,
} from '@fortawesome/free-solid-svg-icons'

const AppHeaderDropdown = () => {
    const navigate = useNavigate()

    const logout = () => {
        navigate('/logout')
    }

    const account = () => {
        navigate('/account')
    }

    const security = () => {
        navigate('/account/security')
    }

    return (
        <CDropdown variant="nav-item">
            <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
                <CAvatar src="https://avatars.githubusercontent.com/u/62317165?v=4" size="md" />
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
                <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
                    Account
                </CDropdownHeader>
                <CDropdownItem onClick={account}>
                    <FontAwesomeIcon icon={faCircleInfo} className="me-2" />
                    About
                </CDropdownItem>
                <CDropdownItem onClick={security}>
                    <FontAwesomeIcon icon={faShieldHalved} className="me-2" />
                    Security
                </CDropdownItem>
                <CDropdownDivider />
                <CDropdownItem onClick={logout}>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="me-2" />
                    Logout
                </CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    )
}

export default AppHeaderDropdown
