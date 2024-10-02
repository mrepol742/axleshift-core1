import React, { createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import MaintenancePage from '../../views/errors/500'

const Maintenance = ({ children }) => {
    if (import.meta.env.VITE_APP_MAINTENANCE === 'true') {
        return <MaintenancePage />
    }
    return <>{children}</>
}

export default Maintenance

Maintenance.propTypes = {
    children: PropTypes.node.isRequired,
}
