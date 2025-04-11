import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import ReactGA from 'react-ga4'
import { VITE_APP_SESSION, VITE_APP_NODE_ENV } from '../../config'
import Err403 from '../../views/errors/403'
import Err500 from '../../views/errors/500'
import Err503 from '../../views/errors/503'
import { useUserProvider } from '../UserProvider'
import _nav from '../../_nav'

const Auth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const token = cookies.get(VITE_APP_SESSION)
        const { user, setUser } = useUserProvider()
        const [isAuth, setIsAuth] = useState(null)
        const [maintenance, setMaintenance] = useState(false)
        const [serverErr, setServerErr] = useState(false)

        let loc = `/login`
        if (window.location.pathname != '/')
            loc = `/login?n=${window.location.pathname}${window.location.search}`

        const checkAuthentication = async () => {
            if (VITE_APP_NODE_ENV === 'production')
                ReactGA.send({ hitType: 'pageview', page: window.location.pathname })
            if (!token) return setIsAuth(false)
            if (user && Object.keys(user).length > 0) return setIsAuth(true)

            axios
                .post(`/auth/verify`, null)
                .then((response) => setUser(response.data))
                .catch((err) => {
                    if (err.status == 503) return setMaintenance(true)
                    if (!err.response) return setServerErr(true)
                    window.location.href = loc
                })
                .finally(() => setIsAuth(true))
        }

        useEffect(() => {
            checkAuthentication()
        }, [])

        if (isAuth === null)
            return (
                <div className={`loading-overlay ${token ? '' : 'bg-dark'}`}>
                    <CSpinner color="primary" variant="grow" />
                </div>
            )

        if (!isAuth) return <Navigate to={loc} />
        if (maintenance) return <Err503 />
        if (serverErr) return <Err500 />

        return <WrappedComponent {...props} />
    }

    return AuthComponent
}

export default Auth
