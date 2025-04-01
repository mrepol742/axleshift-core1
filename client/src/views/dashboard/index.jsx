import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
    CRow,
    CCol,
    CDropdown,
    CDropdownToggle,
    CWidgetStatsA,
    CWidgetStatsF,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartLine } from '@coreui/react-chartjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faChartPie } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
    const widgetChartRef1 = useRef(null)
    const widgetChartRef2 = useRef(null)
    const widgetChartRef3 = useRef(null)
    const widgetChartRef4 = useRef(null)
    const [insights, setInsights] = useState({})
    const calculateAverage = (data) => {
        if (!data || data.length === 0) return 0
        const sum = data.reduce((acc, value) => acc + value, 0)
        return (sum / data.length).toFixed(2)
    }

    const widgetData = [
        {
            color: 'primary',
            value: <>{calculateAverage(insights.shipmetOvertime?.data)}</>,
            title: 'Shipments',
            chartRef: widgetChartRef1,
            pointColor: getStyle('--cui-primary'),
            labels: insights.shipmetOvertime?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: insights.shipmetOvertime?.data || [0, 0, 0, 0, 0, 0],
        },
        {
            color: 'info',
            value: <>{calculateAverage(insights.costOvertime?.data)}</>,
            title: 'Average Cost',
            chartRef: widgetChartRef2,
            pointColor: getStyle('--cui-info'),
            labels: insights.costOvertime?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: insights.costOvertime?.data || [0, 0, 0, 0, 0, 0],
        },
        {
            color: 'warning',
            value: <>{calculateAverage(insights.itemsOvertime?.data)}</>,
            title: 'Items',
            chartRef: widgetChartRef3,
            pointColor: getStyle('--cui-warning'),
            labels: insights.itemsOvertime?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: insights.itemsOvertime?.data || [0, 0, 0, 0, 0, 0],
        },
        {
            color: 'danger',
            value: <>{calculateAverage(insights.weightOvertime?.data)}</>,
            title: 'Weight',
            chartRef: widgetChartRef4,
            pointColor: getStyle('--cui-danger'),
            labels: insights.weightOvertime?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: insights.weightOvertime?.data || [0, 0, 0, 0, 0, 0],
        },
    ]

    const fetch = (url) => {
        return axios
            .get(url)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error fetching dashboard data:', error)
                throw error
            })
    }

    const fetchInsights = async () => {
        const [shipmetOvertime, costOvertime, itemsOvertime, weightOvertime] = await Promise.all([
            fetch('/insights/shipment-overtime'),
            fetch('/insights/cost-overtime'),
            fetch('/insights/items-overtime'),
            fetch('/insights/weight-overtime'),
        ])
        setInsights({
            shipmetOvertime,
            costOvertime,
            itemsOvertime,
            weightOvertime,
        })
    }

    useEffect(() => {
        fetchInsights()
    }, [])

    useEffect(() => {
        document.documentElement.addEventListener('ColorSchemeChange', () => {
            if (widgetChartRef1.current) {
                setTimeout(() => {
                    widgetChartRef1.current.data.datasets[0].pointBackgroundColor =
                        getStyle('--cui-primary')
                    widgetChartRef1.current.update()
                })
            }

            if (widgetChartRef2.current) {
                setTimeout(() => {
                    widgetChartRef2.current.data.datasets[0].pointBackgroundColor =
                        getStyle('--cui-info')
                    widgetChartRef2.current.update()
                })
            }

            if (widgetChartRef3.current) {
                setTimeout(() => {
                    widgetChartRef3.current.data.datasets[0].pointBackgroundColor =
                        getStyle('--cui-info')
                    widgetChartRef3.current.update()
                })
            }

            if (widgetChartRef4.current) {
                setTimeout(() => {
                    widgetChartRef4.current.data.datasets[0].pointBackgroundColor =
                        getStyle('--cui-info')
                    widgetChartRef4.current.update()
                })
            }
        })
    }, [widgetChartRef1, widgetChartRef2, widgetChartRef3, widgetChartRef4])

    const [visible, setVisible] = useState(false)

    return (
        <>
            <CRow className="mb-4" xs={{ gutter: 4 }}>
                {widgetData.map((widget, index) => (
                    <CCol key={index} sm={6} xl={4}>
                        <CWidgetStatsA
                            color={widget.color}
                            value={widget.value}
                            title={widget.title}
                            action={
                                <CButton className="btn" onClick={() => setVisible(true)}>
                                    <FontAwesomeIcon
                                        icon={faEllipsisVertical}
                                        size="lg"
                                        className="text-white"
                                    />
                                </CButton>
                            }
                            chart={
                                <CChartLine
                                    ref={widget.chartRef}
                                    className="mt-3 mx-3"
                                    style={{ height: '70px' }}
                                    data={{
                                        labels: widget.labels,
                                        datasets: [
                                            {
                                                label: widget.title,
                                                backgroundColor: 'transparent',
                                                borderColor: 'rgba(255,255,255,.55)',
                                                pointBackgroundColor: widget.pointColor,
                                                data: widget.data,
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                        },
                                        maintainAspectRatio: false,
                                        scales: {
                                            x: {
                                                border: {
                                                    display: false,
                                                },
                                                grid: {
                                                    display: false,
                                                    drawBorder: false,
                                                },
                                                ticks: {
                                                    display: false,
                                                },
                                            },
                                            y: {
                                                display: false,
                                                grid: {
                                                    display: false,
                                                },
                                                ticks: {
                                                    display: false,
                                                },
                                            },
                                        },
                                        elements: {
                                            line: {
                                                borderWidth: 2,
                                                tension: 0.4,
                                            },
                                            point: {
                                                radius: 6,
                                                hitRadius: 10,
                                                hoverRadius: 4,
                                            },
                                        },
                                    }}
                                />
                            }
                        />
                    </CCol>
                ))}
            </CRow>
            <CRow>
                <CCol xs={6} md={4}>
                    <CWidgetStatsF
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        className="mb-3"
                        color="primary"
                        title="Shipments"
                        value="50%"
                    />
                </CCol>
                <CCol xs={6} md={4}>
                    <CWidgetStatsF
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        className="mb-3"
                        color="warning"
                        title="Shipments"
                        value="50%"
                    />
                </CCol>
                <CCol xs={6} md={4}>
                    <CWidgetStatsF
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        className="mb-3"
                        color="primary"
                        title="Shipments"
                        value="50%"
                    />
                </CCol>
                <CCol xs={6} md={4}>
                    <CWidgetStatsF
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        className="mb-3"
                        color="warning"
                        title="Shipments"
                        value="50%"
                    />
                </CCol>
                <CCol xs={6} md={4}>
                    <CWidgetStatsF
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        className="mb-3"
                        color="primary"
                        title="Shipments"
                        value="50%"
                    />
                </CCol>
                <CCol xs={6} md={4}>
                    <CWidgetStatsF
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        className="mb-3"
                        color="warning"
                        title="Shipments"
                        value="50%"
                    />
                </CCol>
            </CRow>

            <CModal
                alignment="center"
                scrollable
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby=""
            >
                <CModalHeader>
                    <CModalTitle id="">Test</CModalTitle>
                </CModalHeader>
                <CModalBody>Hello World</CModalBody>
            </CModal>
        </>
    )
}

export default Dashboard
