import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const NotificationContext = createContext()

export const AppNotificationProvider = ({ children }) => {
    const [notifs, setNotifications] = useState([])

    const addNotif = (message, header = 'Axleshift') => {
        const newNotif = {
            id: Date.now(),
            message,
            header,
        }
        setNotifications((preveNotif) => [...preveNotif, newNotif])
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
