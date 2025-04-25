import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

const Server = () => {
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
            <Helmet>
                <title>Server Logs - Management | Axleshift</title>
            </Helmet>
            <pre className="bg-body-secondary" style={{ whiteSpace: 'pre-wrap', padding: '10px' }}>
                {logs}
            </pre>
        </div>
    )
}

export default Server
