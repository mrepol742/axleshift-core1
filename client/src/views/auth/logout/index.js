import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'

const Logout = () => {
    const [account] = useState('')
    const navigate = useNavigate()
    const token = Cookies.get(import.meta.env.REACT_APP_SESSION)

    if (token === undefined) navigate('/')

    useEffect(() => {
        logout()
        Cookies.remove(import.meta.env.REACT_APP_SESSION)
        navigate('/')
    }, [])

    async function logout() {
        try {
            await axios.post(
                `${import.meta.env.REACT_APP_API_URL}/api/auth/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
        } catch (error) {
            console.error(error)
        }
    }

    return null
}

export default Logout
