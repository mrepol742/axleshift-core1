import React from 'react'
import { CRow, CCol } from '@coreui/react'
import AccountDetails from './Account'
import Security from './Security'
import DeleteDownload from './DeleteDownload'
import { useUserProvider } from '../../components/UserProvider'

const Account = () => {
     const { user } = useUserProvider()

    return (
        <div className="d-flex flex-column">
            <CRow>
                <CCol xs={12} md={6} lg={5} xl={4}>
                    <AccountDetails />
                </CCol>
                <CCol xs={12} md={6} lg={5} xl={4}>
                    <Security />
                </CCol>
                {user.role === 'user' && (
                    <CCol xs={12} md={6} lg={5} xl={4}>
                        <DeleteDownload />
                    </CCol>
                )}
            </CRow>
        </div>
    )
}

export default Account
