import React from 'react'
import { CCard, CCardBody, CButton } from '@coreui/react'

const Device = () => {
    return (
        <div>
            <h4>Logout other sessions</h4>
            <CCard className="mb-3">
                <CCardBody>
                    <p>
                        Clearing all active user sessions will log you out from all devices and
                        browsers, except for the one you&apos;re currently using.
                    </p>
                    <CButton
                        type="submit"
                        color="danger"
                        className="mt-4 d-block me-2 rounded"
                        disabled
                    >
                        Logout other sessions
                    </CButton>
                </CCardBody>
            </CCard>
        </div>
    )
}

export default Device
