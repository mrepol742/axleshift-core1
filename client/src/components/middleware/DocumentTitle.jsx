import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import routes from '../../routes'
import { VITE_APP_GOOGLE_ANALYTICS } from '../../config'

const DocumentTitle = ({ children }) => {
    let currentLocation = useLocation().pathname
    if (currentLocation != '/') currentLocation = currentLocation.replace(/\/$/, '')

    const getRouteName = (pathname, routes) => {
        const currentRoute = routes.find((route) => route.path === pathname)
        return currentRoute ? currentRoute.name : false
    }

    useEffect(() => {
        let routeName = getRouteName(currentLocation, routes)
        if (routeName) document.title = routeName + ' | Axleshift Core 1'
    }, [currentLocation, routes])

    return <>{children}</>
}

export default DocumentTitle

DocumentTitle.propTypes = {
    children: PropTypes.node.isRequired,
}
