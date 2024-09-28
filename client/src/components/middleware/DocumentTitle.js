import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import routes from '../../routes'

const DocumentTitle = ({ children }) => {
    var currentLocation = useLocation().pathname
    if (currentLocation != '/') currentLocation = currentLocation.replace(/\/$/, '')

    const getRouteName = (pathname, routes) => {
        const currentRoute = routes.find((route) => route.path === pathname)
        return currentRoute ? currentRoute.name : false
    }

    useEffect(() => {
        var routeName = getRouteName(currentLocation, routes)
        if (routeName) document.title = routeName + ' | Freight Core1'
    }, [currentLocation, routes])

    return <>{children}</>
}

export default DocumentTitle

DocumentTitle.propTypes = {
    children: PropTypes.node.isRequired,
}
