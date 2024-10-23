import React, { useEffect, useState } from 'react'
import { CSpinner } from '@coreui/react'
import { VITE_APP_API_URL, VITE_APP_SESSION } from '../../config'

const Account = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchUserData = async () => {
        await axios
            .post(
                `${VITE_APP_API_URL}/api/v1/auth/user`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                    },
                },
            )
            .then((response) => {
                setUser(response.data.user)
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

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
