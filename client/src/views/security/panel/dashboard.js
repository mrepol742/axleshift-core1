import React from 'react'
import { CContainer } from '@coreui/react'

const Dashboard = () => {
    return (
        <>
            <CContainer fluid style={{ height: '100vh' }}>
                <iframe
                    src={`${import.meta.env.VITE_APP_API_URL}/status`}
                    className="rounded"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                />
            </CContainer>
        </>
    )
}

export default Dashboard
