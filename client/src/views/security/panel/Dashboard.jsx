import React, { useEffect, useState } from 'react'
import { CRow, CCol } from '@coreui/react'
import { useToast } from '../../../components/AppToastProvider'
import errorMessages from '../../../components/ErrorMessages'
import Widgets from './dashboard/Widgets'

const Dashboard = () => {
    const [formData, setFormData] = useState(null)
    const [loading, setLoading] = useState(true)
    const { addToast } = useToast()
    const [averageLoadData, setAverageLoadData] = useState(Array(10).fill(0))
    const [totalAverageLoadData, setTotalAverageLoadData] = useState(0)
    const [cpuUsageData, setCPUUsageData] = useState(Array(10).fill(0))
    const [totalCPUUsageData, setTotalCPUUsageData] = useState(0)

    const calculateAverageLoad = (user, system, idle, startTime) => {
        calculateCPUUsage(user, system, idle, startTime)
        const uptime = Date.now() - startTime
        const result = system / uptime
        const average = parseFloat(result.toString().match(/^(\d+\.\d)/))
        setAverageLoadData((prevData) => {
            const newData = [...prevData, average]
            if (newData.length > 10) newData.shift()
            setTotalAverageLoadData(someMath(newData))
            return newData
        })
    }

    const calculateCPUUsage = (user, system, idle, startTime) => {
        const uptime = (Date.now() - startTime) * 4
        const result = (idle / uptime) * 100
        const usage = parseFloat(result.toString().match(/^(\d+\.\d)/))
        setCPUUsageData((prevData) => {
            const newData = [...prevData, usage]
            if (newData.length > 10) newData.shift()
            setTotalCPUUsageData(someMath(newData))
            return newData
        })
    }

    const someMath = (arr) => {
        const nonZeroValues = arr.filter((value) => value !== 0)
        const sum = nonZeroValues.reduce((acc, curr) => acc + curr, 0)
        const count = nonZeroValues.length

        return count === 0 ? 0 : sum / count
    }

    const fetchData = async () => {
        await axios
            .get(`/metrics/prometheus`)
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
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message, 'Submit failed!')
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()

        const intervalId = setInterval(() => {
            fetchData()
        }, 2000)

        return () => clearInterval(intervalId)
    }, [])

    return (
        <div>
            {formData && (
                <>
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
                    {JSON.stringify(formData, null, 4)}
                </>
            )}
        </div>
    )
}

export default Dashboard
