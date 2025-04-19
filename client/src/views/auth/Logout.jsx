import React, { useState, useEffect } from 'react'
import { CContainer, CSpinner } from '@coreui/react'
import { VITE_APP_SESSION } from '../../config'

const Logout = () => {
    const [loading, setLoading] = useState(true)

    const logout = async () => {
        axios.post(`/auth/logout`).finally(() => {
            cookies.remove(VITE_APP_SESSION)
            window.location.href = '/'
        })
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
