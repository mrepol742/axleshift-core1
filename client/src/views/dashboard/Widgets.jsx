import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { CRow, CCol, CDropdown, CDropdownToggle, CWidgetStatsA } from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartLine } from '@coreui/react-chartjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpLong, faArrowDownLong } from '@fortawesome/free-solid-svg-icons'

const Widgets = (props) => {
    const widgetChartRef1 = useRef(null)
    const widgetChartRef2 = useRef(null)

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
        })
    }, [widgetChartRef1, widgetChartRef2])

    return (
        <CRow className={props.className} xs={{ gutter: 4 }}>
            <CCol sm={6} xl={3}>
                <CWidgetStatsA
                    color="primary"
                    value={
                        <>
                            95%{' '}
                            <span className="fs-6 fw-normal">
                                (-12.4% <FontAwesomeIcon icon={faArrowDownLong} />)
                            </span>
                        </>
                    }
                    title="Fleet"
                    action={
                        <CDropdown alignment="end">
                            <CDropdownToggle
                                color="transparent"
                                caret={false}
                                className="text-white p-0"
                            ></CDropdownToggle>
                        </CDropdown>
                    }
                    chart={
                        <CChartLine
                            ref={widgetChartRef1}
                            className="mt-3 mx-3"
                            style={{ height: '70px' }}
                            data={{
                                labels: [
                                    'January',
                                    'February',
                                    'March',
                                    'April',
                                    'May',
                                    'June',
                                    'July',
                                ],
                                datasets: [
                                    {
                                        label: 'Hours',
                                        backgroundColor: 'transparent',
                                        borderColor: 'rgba(255,255,255,.55)',
                                        pointBackgroundColor: getStyle('--cui-primary'),
                                        data: [65, 59, 84, 84, 51, 55, 40],
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
                                        min: 30,
                                        max: 89,
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
                                        borderWidth: 1,
                                        tension: 0.4,
                                    },
                                    point: {
                                        radius: 4,
                                        hitRadius: 10,
                                        hoverRadius: 4,
                                    },
                                },
                            }}
                        />
                    }
                />
            </CCol>
            <CCol sm={6} xl={3}>
                <CWidgetStatsA
                    color="info"
                    value={
                        <>
                            10%{' '}
                            <span className="fs-6 fw-normal">
                                (40.9% <FontAwesomeIcon icon={faArrowUpLong} />)
                            </span>
                        </>
                    }
                    title="Delivery Status"
                    action={
                        <CDropdown alignment="end">
                            <CDropdownToggle
                                color="transparent"
                                caret={false}
                                className="text-white p-0"
                            ></CDropdownToggle>
                        </CDropdown>
                    }
                    chart={
                        <CChartLine
                            ref={widgetChartRef2}
                            className="mt-3 mx-3"
                            style={{ height: '70px' }}
                            data={{
                                labels: [
                                    'January',
                                    'February',
                                    'March',
                                    'April',
                                    'May',
                                    'June',
                                    'July',
                                ],
                                datasets: [
                                    {
                                        label: 'Costs',
                                        backgroundColor: 'transparent',
                                        borderColor: 'rgba(255,255,255,.55)',
                                        pointBackgroundColor: getStyle('--cui-info'),
                                        data: [1334, 18545, 9454, 1447, 34444, 2442, 1441],
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
                                        min: -9,
                                        max: 39,
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
                                        borderWidth: 1,
                                    },
                                    point: {
                                        radius: 4,
                                        hitRadius: 10,
                                        hoverRadius: 4,
                                    },
                                },
                            }}
                        />
                    }
                />
            </CCol>
            <CCol sm={6} xl={3}>
                <CWidgetStatsA
                    color="warning"
                    value={
                        <>
                            1 Ton{' '}
                            <span className="fs-6 fw-normal">
                                (84.7% <FontAwesomeIcon icon={faArrowUpLong} />)
                            </span>
                        </>
                    }
                    title="Weight"
                    action={
                        <CDropdown alignment="end">
                            <CDropdownToggle
                                color="transparent"
                                caret={false}
                                className="text-white p-0"
                            ></CDropdownToggle>
                        </CDropdown>
                    }
                    chart={
                        <CChartLine
                            className="mt-3"
                            style={{ height: '70px' }}
                            data={{
                                labels: [
                                    'January',
                                    'February',
                                    'March',
                                    'April',
                                    'May',
                                    'June',
                                    'July',
                                ],
                                datasets: [
                                    {
                                        label: 'Score',
                                        backgroundColor: 'rgba(255,255,255,.2)',
                                        borderColor: 'rgba(255,255,255,.55)',
                                        data: [78, 81, 80, 45, 34, 12, 40],
                                        fill: true,
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
                                        display: false,
                                    },
                                    y: {
                                        display: false,
                                    },
                                },
                                elements: {
                                    line: {
                                        borderWidth: 2,
                                        tension: 0.4,
                                    },
                                    point: {
                                        radius: 0,
                                        hitRadius: 10,
                                        hoverRadius: 4,
                                    },
                                },
                            }}
                        />
                    }
                />
            </CCol>
            <CCol sm={6} xl={3}>
                <CWidgetStatsA
                    color="warning"
                    value={
                        <>
                            1 Ton{' '}
                            <span className="fs-6 fw-normal">
                                (84.7% <FontAwesomeIcon icon={faArrowUpLong} />)
                            </span>
                        </>
                    }
                    title="Deliveries by Destination"
                    action={
                        <CDropdown alignment="end">
                            <CDropdownToggle
                                color="transparent"
                                caret={false}
                                className="text-white p-0"
                            ></CDropdownToggle>
                        </CDropdown>
                    }
                    chart={
                        <CChartLine
                            className="mt-3"
                            style={{ height: '70px' }}
                            data={{
                                labels: [
                                    'January',
                                    'February',
                                    'March',
                                    'April',
                                    'May',
                                    'June',
                                    'July',
                                ],
                                datasets: [
                                    {
                                        label: 'Score',
                                        backgroundColor: 'rgba(255,255,255,.2)',
                                        borderColor: 'rgba(255,255,255,.55)',
                                        data: [78, 81, 80, 45, 34, 12, 40],
                                        fill: true,
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
                                        display: false,
                                    },
                                    y: {
                                        display: false,
                                    },
                                },
                                elements: {
                                    line: {
                                        borderWidth: 2,
                                        tension: 0.4,
                                    },
                                    point: {
                                        radius: 0,
                                        hitRadius: 10,
                                        hoverRadius: 4,
                                    },
                                },
                            }}
                        />
                    }
                />
            </CCol>
        </CRow>
    )
}

Widgets.propTypes = {
    className: PropTypes.string,
}

export default Widgets
