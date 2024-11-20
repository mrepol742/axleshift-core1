import React from 'react'
import { CCard, CCardBody, CButton } from '@coreui/react'

const Api = () => {
    return (
        <>
            <h4>Deactivate all apikeys</h4>
            <CCard className="mb-3">
                <CCardBody>
                    <p>Clearing all active apikeys will deny future incoming requests.</p>
                    <CButton
                        type="submit"
                        color="danger"
                        className="mt-4 d-block me-2 rounded"
                        disabled
                    >
                        Deactivate all apikeys
                    </CButton>
                </CCardBody>
            </CCard>
            This will list down all api auth token created by user, there last accessed and its
            allowed ip addresses.
        </>
    )
}

export default Api
