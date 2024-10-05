import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'

const Logout = () => {
    const [account] = useState('')
    const navigate = useNavigate()
    const token = Cookies.get(import.meta.env.VITE_APP_SESSION)

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
                Cookies.remove(import.meta.env.VITE_APP_SESSION)
                navigate('/')
            })
            .catch((err) => {
                console.error(err)
            })
    }

    return null
}

export default Logout
