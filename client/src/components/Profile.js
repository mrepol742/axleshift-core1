import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
    return useSelector((state) => state.user)
}

export const isAdmin = () => {
    const user = useSelector((state) => state.user)
    return user.role === 'admin'
}

export default Profile
