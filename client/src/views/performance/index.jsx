import React, { useEffect, useState } from 'react'
import { CRow, CCol, CWidgetStatsF } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faChartPie } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../components/AppToastProvider'
import Widgets from './Widgets'

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
                    error.response?.data?.error ||
                    (error.message === 'network error'
                        ? 'Server is offline or restarting please wait'
                        : error.message)
                addToast(message)
            })
        axios
            .get(`/metrics/mongodb`)
            .then((response) => {
                setFormData(response.data)
            })
            .catch((error) => {
                const message =
                    error.response?.data?.error ||
                    (error.message === 'network error'
                        ? 'Server is offline or restarting please wait'
                        : error.message)
                addToast(message)
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

    if (loading) return ''

    return (
        <div>
            <h4>System</h4>
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
            <h4 className="mt-3">Database</h4>
            <CRow>
                <CCol xs={4}>
                    <CWidgetStatsF
                        className="mb-3 bg-body-secondary"
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        title={`${formData.connections[0].current} Connections`}
                        value={
                            (
                                (formData.connections[0].current /
                                    formData.connections[0].available) *
                                100
                            ).toFixed(2) + '%'
                        }
                    />
                </CCol>
                <CCol xs={4}>
                    <CWidgetStatsF
                        className="mb-3 bg-body-secondary"
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        title={`${formData.oplog[0].getMoreOps} per second`}
                        value={formData.oplog[0].networkBytes + ' bytes'}
                    />
                </CCol>
                <CCol xs={4}>
                    <CWidgetStatsF
                        className="mb-3 bg-body-secondary"
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        title={`${formData.operations[0].insert} insertions`}
                        value={formData.operations[0].query + ' queries'}
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs={4}>
                    <CWidgetStatsF
                        className="mb-3 bg-body-secondary"
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        title={`${formData.operations[0].update} updates`}
                        value={formData.operations[0].delete + ' deletes'}
                    />
                </CCol>
                <CCol xs={4}>
                    <CWidgetStatsF
                        className="mb-3 bg-body-secondary"
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        title={`${formData.operations[0].getmore} getMore operations`}
                        value={formData.operations[0].command + ' commands'}
                    />
                </CCol>
            </CRow>
        </div>
    )
}

export default Dashboard
