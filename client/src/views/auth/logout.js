import React, { useEffect } from 'react'

const Logout = () => {
    useEffect(() => {
        logout()
    }, [])

    const logout = async () => {
        await axios
            .post(
                `${import.meta.env.VITE_APP_API_URL}/api/v1/auth/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${cookies.get(import.meta.env.VITE_APP_SESSION)}`,
                    },
                },
            )
            .then((response) => {
                cookies.remove(import.meta.env.VITE_APP_SESSION)
                window.location.href = '/'
            })
            .catch((error) => {
                console.error(error)
            })
    }

    return null
}

export default Logout
