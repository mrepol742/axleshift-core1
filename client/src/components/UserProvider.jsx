import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({})
    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export const useUserProvider = () => {
    return useContext(UserContext)
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
