import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'

const Logout = () => {
    const [account] = useState('')
    const navigate = useNavigate()

    if (Cookies.get('RCTSESSION') === undefined) navigate('/')

    useEffect(() => {
        logout()
        Cookies.remove('RCTSESSION')
        navigate('/')
    }, [])

    async function logout() {
        try {
            const formData = new FormData()
            formData.append('token', Cookies.get('RCTSESSION'))

            await axios.post('http://localhost:5050/api/auth/logout', formData, {
                headers: {},
            })
        } catch (error) {
            console.error(error)
        }
    }

    return null
}

export default Logout
