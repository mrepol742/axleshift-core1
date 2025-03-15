import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const NotificationContext = createContext()

export const AppNotificationProvider = ({ children }) => {
    const [notifs, setNotifications] = useState([])

    const addNotif = (notif) => {
        setNotifications((prevNotifs) => {
            if (prevNotifs.some((n) => notif._id === n._id)) {
                return prevNotifs
            }

            const updatedNotifs = [...prevNotifs, notif]
            if (updatedNotifs.length > 20) {
                updatedNotifs.shift()
            }

            return updatedNotifs
        })
    }

    return (
        <NotificationContext.Provider value={{ notifs, addNotif }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotif = () => {
    return useContext(NotificationContext)
}

AppNotificationProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
