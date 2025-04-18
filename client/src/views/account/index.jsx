import React from 'react'
import { CRow, CCol } from '@coreui/react'
import AccountDetails from './Account'
import Security from './Security'

const Account = () => {
    return (
        <div className="d-flex flex-column">
            <CRow>
                <CCol xs={12} md={6} lg={5} xl={4}>
                    <AccountDetails />
                </CCol>
                <CCol xs={12} md={6} lg={5} xl={4}>
                    <Security />
                </CCol>
            </CRow>
        </div>
    )
}

export default Account
