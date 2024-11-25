import React from 'react'
import {
    CDropdown,
    CDropdownMenu,
    CDropdownToggle,
    CListGroup,
    CListGroupItem,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { useNotif } from './AppNotificationProvider'
import { parseTimestamp } from '../components/Timestamp'

const AppNotificationDropdown = () => {
    const { notifs } = useNotif()

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
