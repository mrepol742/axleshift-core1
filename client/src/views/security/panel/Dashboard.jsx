import React, { useEffect, useState } from 'react'
import { CRow, CCol } from '@coreui/react'
import { useToast } from '../../../components/AppToastProvider'
import errorMessages from '../../../utils/ErrorMessages'
import Widgets from './dashboard/Widgets'

const Dashboard = () => {
    const [formData, setFormData] = useState(null)
    const [loading, setLoading] = useState(true)
    const { addToast } = useToast()
    const [cpuUsageData, setCpuUsageData] = useState([])
    const [totalAverageLoadData, setTotalAverageLoadData] = useState([])

    const calculateAverageLoad = (userSeconds, systemSeconds, totalSeconds, startTime) => {
        const uptime = Date.now() / 1000 - startTime
        const averageLoad = (userSeconds + systemSeconds) / uptime
        setTotalAverageLoadData((prevData) => [...prevData, parseFloat(averageLoad.toFixed(2))])
    }

    const someMath = (arr) => {
        const nonZeroValues = arr.filter((value) => value !== 0)
        const sum = nonZeroValues.reduce((acc, curr) => acc + curr, 0)
        const count = nonZeroValues.length

        return count === 0 ? 0 : sum / count
    }

    const fetchData = async () => {
        axios
            .get(`/metrics/prometheus`)
            .then((response) => {
                const data = response.data
                setFormData(data)
                calculateAverageLoad(
                    parseFloat(data.process_cpu_user_seconds_total[0].value),
                    parseFloat(data.process_cpu_system_seconds_total[0].value),
                    parseFloat(data.process_cpu_seconds_total[0].value),
                    parseFloat(data.process_start_time_seconds[0].value),
                )
                setCpuUsageData((prevData) => [
                    ...prevData,
                    parseFloat(data.process_cpu_seconds_total[0].value.toFixed(2)),
                ])
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
        }, 5000)

        return () => clearInterval(intervalId)
    }, [])

    if (!formData) return ''

    return (
        <div>
            <CRow xs={{ gutter: 4 }}>
                <CCol sm={6} xl={4} xxl={3}>
                    <Widgets
                        color="primary"
                        title="Average Load Time"
                        value={`${someMath(totalAverageLoadData).toFixed(2)}ms`}
                        data={totalAverageLoadData}
                    />
                </CCol>
                <CCol sm={6} xl={4} xxl={3}>
                    <Widgets
                        color="danger"
                        title="CPU Usage"
                        value={`${someMath(cpuUsageData).toFixed(2)}%`}
                        data={cpuUsageData}
                    />
                </CCol>
            </CRow>
        </div>
    )
}

export default Dashboard
