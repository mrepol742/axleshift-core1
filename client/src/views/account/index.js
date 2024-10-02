import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CSpinner } from '@coreui/react'
import Cookies from 'js-cookie'

const Account = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = Cookies.get(import.meta.env.VITE_APP_SESSION)
                const response = await axios.post(
                    `${import.meta.env.VITE_APP_API_URL}/api/auth/user`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
                const status = response.data.status
                if (status == 200) {
                    setUser(response.data.user)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    if (loading) {
        return (
            <div className="pt-3 text-center">
                <CSpinner color="primary" variant="grow" />
            </div>
        )
    }

    return (
        <div>
            <div>
                <h2>User Information:</h2>
                <p>
                    <strong>First name:</strong> {user.first_name}
                </p>
                <p>
                    <strong>Last name:</strong> {user.last_name}
                </p>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
            </div>
        </div>
    )
}

export default Account
