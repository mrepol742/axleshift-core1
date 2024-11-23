import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { useDispatch } from 'react-redux'
import { VITE_APP_SESSION, VITE_APP_API_URL } from '../../config'
import Err403 from '../../views/errors/403'
import Err500 from '../../views/errors/500'
import Err503 from '../../views/errors/503'

const Auth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const token = cookies.get(VITE_APP_SESSION)
        const navigate = useNavigate()
        const [isAuth, setIsAuth] = useState(null)
        const dispatch = useDispatch()
        const [result, setResult] = useState([])
        const [maintenance, setMaintenance] = useState(false)
        const [serverErr, setServerErr] = useState(false)

        let loc = `/login`
        if (window.location.pathname != '/')
            loc = `/login?n=${window.location.pathname}${window.location.search}`

        const checkAuthentication = async () => {
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
                    dispatch({
                        type: 'set',
                        user: response.data,
                    })
                    setResult(response.data)
                })
                .catch((err) => {
                    console.error(err)
                    if (err.status == 503) return setMaintenance(true)
                    if (!err.response) return setServerErr(true)
                    cookies.remove(VITE_APP_SESSION)
                    window.location.href = loc
                })
                .finally(() => setIsAuth(true))
        }

        useEffect(() => {
            checkAuthentication()
        }, [navigate])

        if (isAuth === null)
            return (
                <div className={`loading-overlay ${!token ? '' : 'bg-dark'}`}>
                    <CSpinner color="primary" variant="grow" />
                </div>
            )

        if (!isAuth) return <Navigate to={loc} />

        if (result.role === 'user') return <Err403 />
        if (result.role === 'user' && maintenance) return <Err503 />
        if (serverErr) return <Err500 />

        return <WrappedComponent {...props} />
    }

    return AuthComponent
}

export default Auth
