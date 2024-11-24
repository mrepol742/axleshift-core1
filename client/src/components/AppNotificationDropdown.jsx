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
    CListGroup,
    CListGroupItem,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { VITE_APP_API_URL } from '../config.js'
import { useNotif } from './AppNotificationProvider'
import { parseTimestamp } from '../components/Timestamp'

const AppNotificationDropdown = () => {
    const { notifs, addNotif } = useNotif()

    return (
        <CDropdown variant="nav-item">
            <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
                <FontAwesomeIcon icon={faBell} />
            </CDropdownToggle>
            <CDropdownMenu className="p-0" placement="bottom-end">
                <CListGroup>
                    <CListGroupItem active>
                        <FontAwesomeIcon icon={faBell} /> Notifications
                    </CListGroupItem>
                    {notifs &&
                        notifs.map((notif) => (
                            <CListGroupItem key={notif.id}>
                                <h6 className="mb-1">{notif.header}</h6>
                                <p className="mb-1">{notif.message}</p>
                                <small>{parseTimestamp(notif.id)}</small>
                            </CListGroupItem>
                        ))}

                    {notifs.length === 0 && (
                        <CListGroupItem className="py-3 my-3" disabled>
                            You have no Notification yet. <br /> Come back later.
                        </CListGroupItem>
                    )}
                </CListGroup>
            </CDropdownMenu>
        </CDropdown>
    )
}

export default AppNotificationDropdown
