import React from 'react'
import PropTypes from 'prop-types'
import {
    CRow,
    CCol,
    CDropdown,
    CDropdownMenu,
    CDropdownItem,
    CDropdownToggle,
    CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpLong, faArrowDownLong } from '@fortawesome/free-solid-svg-icons'

const Widgets = ({ color, title, value, data }) => {
    return (
        <CWidgetStatsA
            color={color}
            value={value}
            title={title}
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
                        labels: Array(10).fill(''),
                        datasets: [
                            {
                                label: 'Data',
                                backgroundColor: 'rgba(255,255,255,.2)',
                                borderColor: 'rgba(255,255,255,.55)',
                                data: data,
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
                        animation: {
                            duration: 0,
                        },
                    }}
                />
            }
        />
    )
}

Widgets.propTypes = {
    color: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    data: PropTypes.any.isRequired,
}

export default Widgets
