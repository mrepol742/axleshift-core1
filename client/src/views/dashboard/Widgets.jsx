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

    const widgetData = [
        {
            color: 'primary',
            value: (
                <>
                    95%
                </>
            ),
            title: 'Shipments',
            chartRef: widgetChartRef1,
            pointColor: getStyle('--cui-primary'),
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            data: [65, 59, 84, 84, 51, 55, 40],
            yScale: { min: 30, max: 89 },
        },
        {
            color: 'info',
            value: (
                <>
                    10%{' '}
                </>
            ),
            title: 'Average Cost',
            chartRef: widgetChartRef2,
            pointColor: getStyle('--cui-info'),
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            data: [1334, 18545, 9454, 1447, 34444, 2442, 1441],
            yScale: { min: -9, max: 39 },
        },
    ]

    return (
        <CRow className={props.className} xs={{ gutter: 4 }}>
            {widgetData.map((widget, index) => (
                <CCol key={index} sm={6} xl={3}>
                    <CWidgetStatsA
                        color={widget.color}
                        value={widget.value}
                        title={widget.title}
                        action={
                            <CDropdown alignment="end">
                                <CDropdownToggle className="text-white p-0"></CDropdownToggle>
                            </CDropdown>
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
                                            min: widget.yScale.min,
                                            max: widget.yScale.max,
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
            ))}
        </CRow>
    )
}

Widgets.propTypes = {
    className: PropTypes.string,
}

export default Widgets
