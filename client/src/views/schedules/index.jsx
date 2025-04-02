import React, { useState, useEffect } from 'react'
import { CSpinner } from '@coreui/react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { useToast } from '../../components/AppToastProvider'

import parseTimestamp from '../../utils/Timestamp'

const localizer = momentLocalizer(moment)

const Schedules = () => {
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])

    const fetchData = async () => {
        axios
            .get(`/freight/calendar`)
            .then((response) => setResult(response.data))
            .catch((error) => {
                const message =
                    error.response?.data?.error || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}
            <Calendar
                events={result}
                localizer={localizer}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                popup
            />
        </div>
    )
}

export default Schedules
