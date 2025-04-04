import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
    CRow,
    CCol,
    CDropdown,
    CDropdownToggle,
    CWidgetStatsA,
    CWidgetStatsB,
    CWidgetStatsC,
    CWidgetStatsF,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CSpinner,
    CListGroup,
    CListGroupItem,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartLine } from '@coreui/react-chartjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faChartPie } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const navigate = useNavigate()
    const widgetChartRef1 = useRef(null)
    const widgetChartRef2 = useRef(null)
    const widgetChartRef3 = useRef(null)
    const widgetChartRef4 = useRef(null)
    const [isActionVisible, setIsActionVisible] = useState(false)
    const [modalUrl, setModalUrl] = useState('')
    const [formData, setFormData] = useState(null)
    const [insights, setInsights] = useState({
        smallDetailWidgets: {
            cancelled: [0, '0%'],
            toPay: [0, '0%'],
            toShip: [0, '0%'],
            toReceive: [0, '0%'],
            received: [0, '0%'],
        },
        invoicesInfoWidgets: {
            success: [0, '0%'],
            expired: [0, '0%'],
        },
    })

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
            url: '/shipments',
        },
        {
            color: 'info',
            value: <>{calculateAverage(insights.costOvertime?.data)}</>,
            title: 'Average Cost',
            chartRef: widgetChartRef2,
            pointColor: getStyle('--cui-info'),
            labels: insights.costOvertime?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: insights.costOvertime?.data || [0, 0, 0, 0, 0, 0],
            url: '/avarage-cost',
        },
        {
            color: 'warning',
            value: <>{calculateAverage(insights.itemsOvertime?.data)}</>,
            title: 'Items',
            chartRef: widgetChartRef3,
            pointColor: getStyle('--cui-warning'),
            labels: insights.itemsOvertime?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: insights.itemsOvertime?.data || [0, 0, 0, 0, 0, 0],
            url: '/items',
        },
        {
            color: 'danger',
            value: <>{calculateAverage(insights.weightOvertime?.data)}</>,
            title: 'Weight',
            chartRef: widgetChartRef4,
            pointColor: getStyle('--cui-danger'),
            labels: insights.weightOvertime?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: insights.weightOvertime?.data || [0, 0, 0, 0, 0, 0],
            url: '/weight',
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
        const fetchData = async () => {
            try {
                const shipmetOvertime = fetch('/insights/shipment-overtime').then((data) =>
                    setInsights((prev) => ({ ...prev, shipmetOvertime: data })),
                )
                const costOvertime = fetch('/insights/cost-overtime').then((data) =>
                    setInsights((prev) => ({ ...prev, costOvertime: data })),
                )
                const itemsOvertime = fetch('/insights/items-overtime').then((data) =>
                    setInsights((prev) => ({ ...prev, itemsOvertime: data })),
                )
                const weightOvertime = fetch('/insights/weight-overtime').then((data) =>
                    setInsights((prev) => ({ ...prev, weightOvertime: data })),
                )
                const smallDetailWidgets = fetch('/insights/shipment-info-widgets').then((data) =>
                    setInsights((prev) => ({ ...prev, smallDetailWidgets: data })),
                )
                const invoicesInfoWidgets = fetch('/insights/invoices-info-widgets').then((data) =>
                    setInsights((prev) => ({ ...prev, invoicesInfoWidgets: data })),
                )

                await Promise.all([
                    shipmetOvertime,
                    costOvertime,
                    itemsOvertime,
                    weightOvertime,
                    smallDetailWidgets,
                    invoicesInfoWidgets,
                ])
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            }
        }

        fetchData()
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

    const renderDashboardWidgets = async (url) => {
        try {
            setIsActionVisible(true)
            const response = await axios.get(`/insights/modal${url}`)
            const data = response.data
            setFormData({ url, data })
        } catch (error) {
            console.error('Error fetching dashboard widgets:', error)
        }
    }

    const getHeaderTitle = (url) => {
        switch (url) {
            case '/cancelled':
                return 'Cancelled Shipments'
            case '/to_pay':
                return 'Waiting For Payments'
            case '/to_ship':
                return 'Waiting For Pickup'
            case '/to_receive':
                return 'On the Way'
            case '/received':
                return 'Completed Shipments'
            case '/PAID':
                return 'Successful Invoices'
            case '/EXPIRED':
                return 'Expired Invoices'
            default:
                return ''
        }
    }

    return (
        <>
            <CRow className="mb-4" xs={{ gutter: 4 }}>
                {widgetData.map((widget, index) => (
                    <CCol key={index} sm={6} xl={4}>
                        <CWidgetStatsA
                            data-aos="fade-up"
                            color={widget.color}
                            value={widget.value}
                            title={widget.title}
                            action={
                                <CButton
                                    className="btn"
                                    onClick={() => renderDashboardWidgets(widget.url)}
                                >
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
                <CCol xs={12} md={4}>
                    <CWidgetStatsF
                        onClick={() => renderDashboardWidgets('/cancelled')}
                        data-aos="fade-up"
                        data-aos-delay="200"
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        className="mb-3"
                        color="danger"
                        title="Cancelled Shipments"
                        value={insights.smallDetailWidgets.cancelled[1]}
                    />
                </CCol>
                <CCol xs={12} md={4}>
                    <CWidgetStatsF
                        onClick={() => renderDashboardWidgets('/to_pay')}
                        data-aos="fade-up"
                        data-aos-delay="300"
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        className="mb-3"
                        color="info"
                        title="Waiting For Payments"
                        value={insights.smallDetailWidgets.toPay[1]}
                    />
                </CCol>
                <CCol xs={12} md={4}>
                    <CWidgetStatsF
                        onClick={() => renderDashboardWidgets('/to_ship')}
                        data-aos="fade-up"
                        data-aos-delay="400"
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        className="mb-3"
                        color="secondary"
                        title="Waiting For Pickup"
                        value={insights.smallDetailWidgets.toShip[1]}
                    />
                </CCol>
                <CCol xs={12} md={4}>
                    <CWidgetStatsF
                        onClick={() => renderDashboardWidgets('/to_receive')}
                        data-aos="fade-up"
                        data-aos-delay="500"
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        className="mb-3"
                        color="warning"
                        title="On the Way"
                        value={insights.smallDetailWidgets.toReceive[1]}
                    />
                </CCol>
                <CCol xs={12} md={4}>
                    <CWidgetStatsF
                        onClick={() => renderDashboardWidgets('/received')}
                        data-aos="fade-up"
                        data-aos-delay="600"
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        className="mb-3"
                        color="primary"
                        title="Completed Shipments"
                        value={insights.smallDetailWidgets.received[1]}
                    />
                </CCol>
            </CRow>
            <h5>Invoices</h5>
            <CRow>
                <CCol xs={12} md={6}>
                    <CWidgetStatsC
                        onClick={() => renderDashboardWidgets('/PAID')}
                        data-aos="fade-up"
                        data-aos-delay="700"
                        className="mb-3"
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        progress={{
                            color: 'success',
                            value: insights.invoicesInfoWidgets.success[0],
                        }}
                        title="Successful"
                        value={insights.invoicesInfoWidgets.success[1]}
                    />
                </CCol>
                <CCol xs={12} md={6}>
                    <CWidgetStatsC
                        onClick={() => renderDashboardWidgets('/EXPIRED')}
                        data-aos="fade-up"
                        data-aos-delay="800"
                        className="mb-3"
                        icon={<FontAwesomeIcon icon={faChartPie} />}
                        progress={{
                            color: 'danger',
                            value: insights.invoicesInfoWidgets.expired[0],
                        }}
                        title="Expired"
                        value={insights.invoicesInfoWidgets.expired[1]}
                    />
                </CCol>
            </CRow>
            <CModal
                alignment="center"
                scrollable
                visible={isActionVisible}
                onClose={() => setIsActionVisible(false)}
                aria-labelledby="M"
            >
                <div>
                    {!formData?.data ? (
                        <div className="d-flex justify-content-center">
                            <CSpinner color="primary" />
                        </div>
                    ) : (
                        <>
                            <CModalHeader>{getHeaderTitle(formData.url)}</CModalHeader>
                            <CListGroup>
                                {formData.data.length === 0 && (
                                    <div className="d-flex justify-content-center">
                                        <p className="mb-3">No data available</p>
                                    </div>
                                )}

                                {formData.data.length > 0 &&
                                    formData.data.map((item, index) => (
                                        <CListGroupItem
                                            key={index}
                                            onClick={(e) =>
                                                navigate(
                                                    `/shipment/${item.tracking_number ? item.tracking_number : item.freight_tracking_number}`,
                                                )
                                            }
                                        >
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1">
                                                    {item.tracking_number
                                                        ? item.tracking_number
                                                        : item.freight_tracking_number}
                                                </h5>
                                                <small>3 days ago</small>
                                            </div>
                                            {item.to && (
                                                <>
                                                    <p className="mb-1">
                                                        {item.to[0].address}, {item.to[0].city},{' '}
                                                        {item.to[0].country} {item.to[0].zip_code}
                                                    </p>
                                                    <small>{item.to[0].name}</small>
                                                </>
                                            )}
                                        </CListGroupItem>
                                    ))}
                            </CListGroup>
                        </>
                    )}
                </div>
            </CModal>
        </>
    )
}

export default Dashboard
