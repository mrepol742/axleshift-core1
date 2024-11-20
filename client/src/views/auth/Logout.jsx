import React, { useState, useEffect } from 'react'
import { CContainer, CSpinner } from '@coreui/react'
import { VITE_APP_API_URL, VITE_APP_SESSION } from '../../config'

const Logout = () => {
    const [loading, setLoading] = useState(true)

    const logout = async () => {
        await axios
            .post(
                `${VITE_APP_API_URL}/api/v1/auth/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                    },
                },
            )
            .then((response) => {
                cookies.remove(VITE_APP_SESSION)
                window.location.href = '/'
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        logout()
    }, [])

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <div className="auth-bg" />
            <CContainer>
                {loading && (
                    <div className="loading-overlay">
                        <CSpinner color="primary" variant="grow" />
                    </div>
                )}
                <p className="text-center">Processing...</p>
            </CContainer>
        </div>
    )
}

export default Logout
