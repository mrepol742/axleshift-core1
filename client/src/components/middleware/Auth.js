import React from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const isAuthenticated = () => {
    return Cookies.get('RCTSESSION') !== undefined
}

const Auth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        if (!isAuthenticated()) {
            return <Navigate to="/login" />
        }
        return <WrappedComponent {...props} />
    }

    AuthComponent.displayName = `Auth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
    return AuthComponent
}

export default Auth
