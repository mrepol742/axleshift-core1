import React, { useState, useEffect } from 'react'
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
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import Profile from '../components/Profile'
import { VITE_APP_API_URL } from '../config.js'

const AppNotificationDropdown = () => {
    return (
        <CDropdown variant="nav-item">
            <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
                <FontAwesomeIcon icon={faBell} />
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
                <CDropdownItem className="py-3 my-3" disabled>
                    You have no Notification yet. <br /> Come back later.
                </CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    )
}

export default AppNotificationDropdown
