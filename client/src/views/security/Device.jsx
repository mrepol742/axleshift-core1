import React from 'react'
import { CCard, CCardBody, CButton, CRow, CCol } from '@coreui/react'

const Device = () => {
    return (
        <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
            <CCol className="mb-3">
                <h4>Last login IP Address</h4>
                <CCard>
                    <CCardBody>
                        <p className="display-3">127.0.0.1</p>
                        <span className="lead">Philippines</span>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol className="mb-3">
                <h4>Logout other sessions</h4>
                <CCard>
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
            </CCol>
        </CRow>
    )
}

export default Device
