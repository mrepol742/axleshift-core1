import React from 'react'
import { CContainer } from '@coreui/react'
import { VITE_APP_API_URL } from '../../../config'

const Dashboard = () => {
    return (
        <>
            <CContainer fluid style={{ height: '100vh' }}>
                <iframe
                    src={`${VITE_APP_API_URL}/status`}
                    className="rounded"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                />
            </CContainer>
        </>
    )
}

export default Dashboard
