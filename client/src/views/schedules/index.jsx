import React, { useState, useEffect } from 'react'
import { CSpinner } from '@coreui/react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { useToast } from '../../components/AppToastProvider'
import errorMessages from '../../components/ErrorMessages'
import { parseTimestamp } from '../../components/Timestamp'

const localizer = momentLocalizer(moment)

const Schedules = () => {
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])

    const fetchData = async () => {
        axios
            .get(`/schedules`)
            .then((response) => setResult(response.data))
            .catch((error) => {
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
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
            />
        </div>
    )
}

export default Schedules
