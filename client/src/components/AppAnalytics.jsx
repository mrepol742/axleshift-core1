import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { initGA, trackPageview } from '../analytics'
import { VITE_APP_NODE_ENV } from '../config'

const AppAnalytics = ({ children }) => {
    const location = useLocation()

    useEffect(() => {
        if (VITE_APP_NODE_ENV === 'production') initGA()
    }, [])

    useEffect(() => {
        if (VITE_APP_NODE_ENV === 'production') trackPageview(location.pathname)
    }, [location])

    return <>{children}</>
}

export default React.memo(AppAnalytics)

AppAnalytics.propTypes = {
    children: PropTypes.node.isRequired,
}
