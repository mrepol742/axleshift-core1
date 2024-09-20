import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const [account] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        navigate('/')
    }, [navigate])

    return null
}

export default Logout
