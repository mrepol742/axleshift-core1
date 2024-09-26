import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'

const Auth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const navigate = useNavigate()
        const [isAuth, setIsAuth] = useState(null)

        useEffect(() => {
            const checkAuthentication = async () => {
                const token = Cookies.get('RCTSESSION')
                if (token === undefined) return setIsAuth(false)

                try {
                    const response = await axios.post(
                        'http://localhost:5050/api/auth/verify',
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    )

                    if (response.data.status !== 200) {
                        Cookies.remove('RCTSESSION')
                        setIsAuth(false)
                        navigate('/login')
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
            return <div>Loading...</div>
        }

        if (!isAuth) {
            return <Navigate to="/login" />
        }

        return <WrappedComponent {...props} />
    }

    AuthComponent.displayName = `Auth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
    return AuthComponent
}

export default Auth
