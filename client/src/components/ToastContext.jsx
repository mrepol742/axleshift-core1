import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const addToast = (message, header = 'Welcome') => {
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

ToastProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
