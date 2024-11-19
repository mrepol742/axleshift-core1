import React, { useEffect, useState } from 'react'
import { CContainer } from '@coreui/react'
import { useToast } from '../../../components/AppToastProvider'
import errorMessages from '../../../components/ErrorMessages'
import { VITE_APP_API_URL, VITE_APP_SESSION } from '../../../config'

const Dashboard = () => {
    const [formData, setFormData] = useState(null)
    const [loading, setLoading] = useState(false)
    const { addToast } = useToast()

    const fetchData = async () => {
        setLoading(true)
        await axios
            .get(`${VITE_APP_API_URL}/metrics/v1/prometheus/json`, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => {
                setFormData(response.data)
            })
            .catch((error) => {
                console.error(error)
                const message = errorMessages[error.status] || 'Internal Application Error'
                addToast(message, 'Submit failed!')
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()

        const intervalId = setInterval(() => {
            fetchData()
        }, 5000)

        return () => clearInterval(intervalId)
    }, [])

    return <>{JSON.stringify(formData, null, 4)}</>
}

export default Dashboard
