import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { VITE_APP_SESSION } from '../../config'
import Err403 from '../../views/errors/403'
import Err500 from '../../views/errors/500'
import Err503 from '../../views/errors/503'
import { useUserProvider } from '../UserProvider'
import _nav from '../../_nav'

const Auth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const token = cookies.get(VITE_APP_SESSION)
        const { user, setUser } = useUserProvider()
        const navigate = useNavigate()
        const location = useLocation()
        const currentPage = location.pathname
        const [isAuth, setIsAuth] = useState(null)
        const [result, setResult] = useState([])
        const [maintenance, setMaintenance] = useState(false)
        const [serverErr, setServerErr] = useState(false)
        // const [accessResults, setAccessResults] = useState(false)

        let loc = `/login`
        if (window.location.pathname != '/')
            loc = `/login?n=${window.location.pathname}${window.location.search}`

        const checkAuthentication = async () => {
            if (!token) return setIsAuth(false)
            // const _accessResults = _nav
            //     .filter((item) => {
            //         return item.to === currentPage
            //     })
            //     .map((item) => {
            //         return Array.isArray(item.role_exclude) && item.role_exclude.includes(user.role)
            //     })

            // setAccessResults(!_accessResults[0])

            if (user && Object.keys(user).length > 0) return setIsAuth(true)

            axios
                .post(`/auth/verify`, null)
                .then((response) => {
                    if (response.data.otp) return (window.location.href = '/one-time-password')
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

        // if (accessResults) return <Err403 />

        if (!isAuth) return <Navigate to={loc} />

        // if ((user ? user.role : result.role) === 'user') return <Err403 />
        if (maintenance) return <Err503 />
        if (serverErr) return <Err500 />

        return <WrappedComponent {...props} />
    }

    return AuthComponent
}

export default Auth
