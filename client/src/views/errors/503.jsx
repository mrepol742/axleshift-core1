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

const Page503 = () => {
    return (
        <div className="min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={6}>
                        <span className="clearfix">
                            <h1 className="float-start display-3 me-4">503</h1>
                            <h4>Houston, right timing isnt it?</h4>
                            <p className="text-body-secondary float-start">
                                Our site is currently under maintenance, have a coffee for a while.
                            </p>
                        </span>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default Page503
