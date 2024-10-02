import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import { CSpinner } from '@coreui/react'
import MaintenancePage from '../../views/errors/500'

const Auth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const navigate = useNavigate()
        const [isAuth, setIsAuth] = useState(null)
        let loc = `/login`
        if (window.location.pathname != '/')
            loc = `/login?n=${window.location.pathname}${window.location.search}`

        useEffect(() => {
            const checkAuthentication = async () => {
                const token = Cookies.get(import.meta.env.REACT_APP_SESSION)
                if (token === undefined) return setIsAuth(false)

                try {
                    const response = await axios.post(
                        `${import.meta.env.REACT_APP_API_URL}/api/auth/verify`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    )

                    if (response.data.status !== 200) {
                        Cookies.remove(import.meta.env.REACT_APP_SESSION)
                        setIsAuth(false)
                        navigate(loc)
                    } else {
                        setIsAuth(true)
                    }
                } catch (error) {
                    alert(error)
                    setIsAuth(false)
                }
            }

            checkAuthentication()
        }, [navigate])

        if (isAuth === null) {
            return (
                <div className="pt-3 text-center">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )
        }

        if (!isAuth) {
            return <Navigate to={loc} />
        }

        return <WrappedComponent {...props} />
    }

    AuthComponent.displayName = `Auth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
    return AuthComponent
}

export default Auth
