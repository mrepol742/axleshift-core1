import React, { useEffect, useState, useRef } from 'react'
import { CContainer, CRow, CCol } from '@coreui/react'
import { useToast } from '../../../components/AppToastProvider'
import errorMessages from '../../../components/ErrorMessages'
import { VITE_APP_API_URL, VITE_APP_SESSION } from '../../../config'
import Widgets from './dashboard/Widgets'

const Dashboard = () => {
    const [formData, setFormData] = useState(null)
    const [loading, setLoading] = useState(false)
    const { addToast } = useToast()
    const [averageLoadData, setAverageLoadData] = useState(Array(10).fill(0))
    const [totalAverageLoadData, setTotalAverageLoadData] = useState(0)
    const [cpuUsageData, setCPUUsageData] = useState(Array(10).fill(0))
    const [totalCPUUsageData, setTotalCPUUsageData] = useState(0)

    const calculateAverageLoad = (user, system, idle, startTime) => {
        calculateCPUUsage(user, system, idle, startTime)
        const uptime = Date.now() - startTime
        const average = system / uptime
        setAverageLoadData((prevData) => {
            const newData = [...prevData, average]
            if (newData.length > 10) newData.shift()
            return newData
        })
        const _average = averageLoadData.reduce((sum, value) => sum + value, 0)
        setTotalAverageLoadData(_average)
    }

    const calculateCPUUsage = (user, system, idle, startTime) => {
        const uptime = (Date.now() - startTime) * 4
        const usage = (idle / uptime) * 100
        setCPUUsageData((prevData) => {
            const newData = [...prevData, usage]
            if (newData.length > 10) newData.shift()
            return newData
        })
        const _average = cpuUsageData.reduce((sum, value) => sum + value, 0)
        setTotalCPUUsageData(_average)
    }

    const fetchData = async () => {
        setLoading(true)
        await axios
            .get(`${VITE_APP_API_URL}/metrics/v1/prometheus`, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => {
                const data = response.data
                setFormData(data)
                calculateAverageLoad(
                    data.process_cpu_user_seconds_total[0].value,
                    data.process_cpu_system_seconds_total[0].value,
                    data.process_cpu_seconds_total[0].value,
                    data.process_start_time_seconds[0].value,
                )
            })
            .catch((error) => {
                if (error.status == 401) return window.location.reload()
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
        }, 1500)

        return () => clearInterval(intervalId)
    }, [])

    return (
        <>
            {formData && (
                <CRow xs={{ gutter: 4 }}>
                    <CCol sm={6} xl={4} xxl={3}>
                        <Widgets
                            color="primary"
                            title="Average Load Time"
                            value={totalAverageLoadData}
                            data={averageLoadData}
                        />
                    </CCol>
                    <CCol sm={6} xl={4} xxl={3}>
                        <Widgets
                            color="danger"
                            title="CPU Usage"
                            value={`${totalCPUUsageData}%`}
                            data={cpuUsageData}
                        />
                    </CCol>
                </CRow>
            )}
            {JSON.stringify(formData, null, 4)}
        </>
    )
}

export default Dashboard
