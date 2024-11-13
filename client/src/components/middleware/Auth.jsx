import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { useDispatch } from 'react-redux'
import { VITE_APP_SESSION, VITE_APP_API_URL } from '../../config'

const Auth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const navigate = useNavigate()
        const [isAuth, setIsAuth] = useState(null)
        const [otp, setOtp] = useState(false)
        const dispatch = useDispatch()

        let loc = `/login`
        if (window.location.pathname != '/')
            loc = `/login?n=${window.location.pathname}${window.location.search}`

        const checkAuthentication = async () => {
            const token = cookies.get(VITE_APP_SESSION)
            if (token === undefined) return setIsAuth(false)

            await axios
                .post(
                    `${VITE_APP_API_URL}/api/v1/auth/verify`,
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
                    cookies.remove(VITE_APP_SESSION)
                    setIsAuth(false)
                    window.location.href = loc
                })
        }

        useEffect(() => {
            checkAuthentication()
        }, [navigate])

        if (otp) return <Navigate to={loc.replace('/login', '/otp')} />

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
