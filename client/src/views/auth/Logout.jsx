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
        if (!cookies.get(VITE_APP_SESSION)) return (window.location.href = '/')
        logout()
    }, [])

    return (
        <CContainer>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}
        </CContainer>
    )
}

export default Logout
