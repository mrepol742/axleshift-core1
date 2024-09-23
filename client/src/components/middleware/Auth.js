/* eslint-disable react/display-name */
import React from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const isAuthenticated = () => {
    return Cookies.get('RCTSESSION') !== undefined
}

const Auth = (WrappedComponent) => {
    return (props) => {
        if (!isAuthenticated()) {
            return <Navigate to="/login" />
        }
        return <WrappedComponent {...props} />
    }
}

export default Auth
