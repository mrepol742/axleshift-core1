import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const [account] = useState('')
    const navigate = useNavigate()
    const token = cookies.get(import.meta.env.VITE_APP_SESSION)

    useEffect(() => {
        if (token === undefined) return navigate('/')
        logout()
    }, [])

    const logout = async () => {
        await axios
            .post(
                `${import.meta.env.VITE_APP_API_URL}/api/v1/auth/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
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
