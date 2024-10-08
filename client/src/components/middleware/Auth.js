import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import { CSpinner } from '@coreui/react'
import { useDispatch } from 'react-redux'
import MaintenancePage from '../../views/errors/500'

const Auth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const navigate = useNavigate()
        const [isAuth, setIsAuth] = useState(null)
        const dispatch = useDispatch()

        let loc = `/login`
        if (window.location.pathname != '/')
            loc = `/login?n=${window.location.pathname}${window.location.search}`

        const checkAuthentication = async () => {
            const token = Cookies.get(import.meta.env.VITE_APP_SESSION)
            if (token === undefined) return setIsAuth(false)

            await axios
                .post(
                    `${import.meta.env.VITE_APP_API_URL}/api/v1/auth/verify`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
                .then((response) => {
                    dispatch({
                        type: 'set',
                        email: response.data.email,
                        role: response.data.role,
                    })

                    setIsAuth(true)
                })
                .catch((err) => {
                    console.error(err)
                    Cookies.remove(import.meta.env.VITE_APP_SESSION)
                    setIsAuth(false)
                    navigate(loc)
                })
        }

        useEffect(() => {
            checkAuthentication()
        }, [navigate])

        if (isAuth === null)
            return (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )

        if (!isAuth) return <Navigate to={loc} />

        return <WrappedComponent {...props} />
    }

    AuthComponent.displayName = `Auth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
    return AuthComponent
}

export default Auth
