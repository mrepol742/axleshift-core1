import React, { useEffect } from 'react'
import { VITE_APP_API_URL, VITE_APP_SESSION } from '../../config'

const Logout = () => {
    useEffect(() => {
        logout()
    }, [])

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
    }

    return null
}

export default Logout
