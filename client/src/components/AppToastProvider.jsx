import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const ToastContext = createContext()

export const AppToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const addToast = (message, header = 'Axleshift') => {
        const newToast = {
            id: Date.now(),
            message,
            header,
        }
        setToasts((prevToasts) => [...prevToasts, newToast])
    }

    return <ToastContext.Provider value={{ toasts, addToast }}>{children}</ToastContext.Provider>
}

export const useToast = () => {
    return useContext(ToastContext)
}

AppToastProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
