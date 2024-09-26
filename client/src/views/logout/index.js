import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'

const Logout = () => {
    const [account] = useState('')
    const navigate = useNavigate()
    const token = Cookies.get('RCTSESSION')

    if (token === undefined) navigate('/')

    useEffect(() => {
        logout()
        Cookies.remove('RCTSESSION')
        navigate('/')
    }, [])

    async function logout() {
        try {
            await axios.post(
                'http://localhost:5050/api/auth/logout',
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
