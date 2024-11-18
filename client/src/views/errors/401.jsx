import React from 'react'
import {
    CButton,
    CCol,
    CContainer,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'

const Page401 = () => {
    return (
        <div className="min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={6}>
                        <div className="clearfix">
                            <h1 className="float-start display-3 me-4">401</h1>
                            <h4>Oops! You{"'"}re not authorized.</h4>
                            <p className="text-body-secondary float-start">
                                You are not authorized to view this page content.
                            </p>
                        </div>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default Page401
