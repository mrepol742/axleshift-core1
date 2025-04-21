import React, { useEffect, useState } from 'react'

const LogManagement = () => {
    const [logs, setLogs] = useState('')

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get('/sec/management/server-logs')
                setLogs(response.data)
            } catch (error) {
                console.error('Error occurred while fetching server logs:', error)
            }
        }

        fetchLogs()
    }, [])

    return (
        <div>
            <h1>Server Logs</h1>
            <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f4f4f4', padding: '10px' }}>
                {logs}
            </pre>
        </div>
    )
}

export default LogManagement
