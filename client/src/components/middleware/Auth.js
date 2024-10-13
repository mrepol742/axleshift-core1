import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { useDispatch } from 'react-redux'
import MaintenancePage from '../../views/errors/500'

const Auth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const navigate = useNavigate()
        const [isAuth, setIsAuth] = useState(null)
        const [otp, setOtp] = useState(false)
        const dispatch = useDispatch()

        let loc = `/`
        if (window.location.pathname != '/')
            loc = `/login?n=${window.location.pathname}${window.location.search}`

        const checkAuthentication = async () => {
            const token = cookies.get(import.meta.env.VITE_APP_SESSION)
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
                    if (response.data.otp) {
                        setOtp(true)
                        setIsAuth(false)
                        return
                    }
                    dispatch({
                        type: 'set',
                        user: response.data,
                    })
                    setIsAuth(true)
                })
                .catch((err) => {
                    if (!err.response) return console.error(err)
                    cookies.remove(import.meta.env.VITE_APP_SESSION)
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

        if (otp) return <Navigate to={loc.replace('/login', '/otp')} />
        if (!isAuth) return <Navigate to={loc} />

        return <WrappedComponent {...props} />
    }

    AuthComponent.displayName = `Auth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
    return AuthComponent
}

export default Auth
