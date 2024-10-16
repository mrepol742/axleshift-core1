import React from 'react'

const Dashboard = () => {
    return (
        <>
            <iframe
                className="rounded"
                src={`${import.meta.env.VITE_APP_API_URL}/status`}
                width="100%"
                height="430px"
            ></iframe>
        </>
    )
}

export default Dashboard
