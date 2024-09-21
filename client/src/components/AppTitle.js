import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import routes from '../routes'

// eslint-disable-next-line react/prop-types
const AppTitle = ({ children }) => {
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

export default AppTitle
