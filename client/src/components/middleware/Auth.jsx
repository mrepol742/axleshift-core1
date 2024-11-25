import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { VITE_APP_SESSION } from '../../config'
import Err403 from '../../views/errors/403'
import Err500 from '../../views/errors/500'
import Err503 from '../../views/errors/503'
import { useUserProvider } from '../UserProvider'

const Auth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const token = cookies.get(VITE_APP_SESSION)
        const { user, setUser } = useUserProvider()
        const navigate = useNavigate()
        const [isAuth, setIsAuth] = useState(null)
        const [result, setResult] = useState([])
        const [maintenance, setMaintenance] = useState(false)
        const [serverErr, setServerErr] = useState(false)

        let loc = `/login`
        if (window.location.pathname != '/')
            loc = `/login?n=${window.location.pathname}${window.location.search}`

        const checkAuthentication = async () => {
            if (!token) return setIsAuth(false)
            if (user && Object.keys(user).length > 0) return setIsAuth(true)

            await axios
                .post(`/auth/verify`, null)
                .then((response) => {
                    if (response.data.otp) return (window.location.href = '/otp')
                    setUser(response.data)
                    setResult(response.data)
                })
                .catch((err) => {
                    if (err.status == 503) return setMaintenance(true)
                    if (!err.response) return setServerErr(true)
                    window.location.href = loc
                })
                .finally(() => setIsAuth(true))
        }

        useEffect(() => {
            window.scrollTo(0, 0)
            checkAuthentication()
        }, [navigate])

        if (isAuth === null)
            return (
                <div className={`loading-overlay ${token ? '' : 'bg-dark'}`}>
                    <CSpinner color="primary" variant="grow" />
                </div>
            )

        if (!isAuth) return <Navigate to={loc} />

        if ((user ? user.role : result.role) === 'user') return <Err403 />
        if ((user ? user.role : result.role) === 'user' && maintenance) return <Err503 />
        if (serverErr) return <Err500 />

        return <WrappedComponent {...props} />
    }

    return AuthComponent
}

export default Auth
