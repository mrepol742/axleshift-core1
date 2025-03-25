import React from 'react'
import { CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const MyAddresses = () => {
    const navigate = useNavigate()

    return (
        <div className="d-block d-sm-flex justify-content-between align-items-center mb-3">
            <h4>Address</h4>
            <CButton
                color="primary"
                size="sm"
                onClick={(e) => navigate('/my-addresses/new')}
                className="ms-auto"
            >
                Add new Address
            </CButton>
        </div>
    )
}

export default MyAddresses
