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
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker
                        .getRegistrations()
                        .then(function (registrations) {
                            registrations.forEach(function (registration) {
                                registration.unregister().then(function (success) {
                                    if (success) {
                                        console.log('Service worker unregistered successfully')
                                    } else {
                                        console.log('Failed to unregister service worker')
                                    }
                                })
                            })
                        })
                        .catch(function (error) {
                            console.error('Error fetching service worker registrations:', error)
                        })
                }
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
