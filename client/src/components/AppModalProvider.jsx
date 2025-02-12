import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const ModalContext = createContext()

export const AppModalProvider = ({ children }) => {
    const [modal, setModal] = useState([])

    const addModal = (header = 'Axleshift', body = '', footer = '', primaryButton) => {
        const newModal = {
            id: Date.now(),
            header,
            body,
            footer,
            primaryButton,
        }
        setModal((prevModal) => [...prevModal, newModal])
    }

    return <ModalContext.Provider value={{ modal, addModal }}>{children}</ModalContext.Provider>
}

export const useModal = () => {
    return useContext(ModalContext)
}

AppModalProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
