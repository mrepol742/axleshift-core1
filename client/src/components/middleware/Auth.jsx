import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { useDispatch } from 'react-redux'
import { VITE_APP_SESSION, VITE_APP_API_URL } from '../../config'

const Auth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const navigate = useNavigate()
        const [isAuth, setIsAuth] = useState(null)
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
                    if (response.data.otp) return (window.location.href = '/otp')
                    if (response.data.role === 'user') return (window.location.href = '/hold-on')
                    dispatch({
                        type: 'set',
                        user: response.data,
                    })
                    setIsAuth(true)
                })
                .catch((err) => {
                    console.error(err)
                    if (err.status == 503) {
                        dispatch({
                            type: 'set',
                            maintenance: true,
                        })
                        return (window.location.href = loc)
                    }
                    if (err.status >= 500) {
                        dispatch({
                            type: 'set',
                            error: true,
                        })
                    } else {
                        cookies.remove(VITE_APP_SESSION)
                    }
                    window.location.href = loc
                })
        }

        useEffect(() => {
            checkAuthentication()
        }, [navigate])

        if (isAuth === null)
            return (
                <div className="loading-overlay bg-dark">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )

        if (!isAuth) return <Navigate to={loc} />

        return <WrappedComponent {...props} />
    }

    return AuthComponent
}

export default Auth
