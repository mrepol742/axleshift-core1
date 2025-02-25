import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CForm,
    CRow,
    CCol,
    CFormSwitch,
    CFormCheck,
    CFormSelect,
    CTabs,
    CTabList,
    CTab,
    CTabContent,
    CTabPanel,
    CButton,
    CFormInput,
    CCard,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPrint, faCopy } from '@fortawesome/free-solid-svg-icons'

// TODO: do rate stuff here
const Review = ({ form, setForm }) => {
    const formRef = React.useRef(null)

    return (
        <CForm ref={formRef}>
            <h3 className="text-primary mt-4" id="review">
                Review
            </h3>

            <CRow>
                <CCol md className="mb-4">
                    <CFormInput
                        type="text"
                        floatingLabel="Shipment Date"
                        className="mb-2"
                        value={'25 Feb 2025'}
                        disabled
                    />
                    <CButton className="btn btn-outline-primary mt-2 me-2">
                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                        Email Quotes
                    </CButton>
                    <CButton className="btn btn-outline-primary mt-2 me-2">
                        <FontAwesomeIcon icon={faPrint} className="me-2" />
                        Print Quotes
                    </CButton>
                    <CButton className="btn btn-outline-primary mt-2 me-2">
                        <FontAwesomeIcon icon={faCopy} className="me-2" />
                        Copy
                    </CButton>
                </CCol>
                <CCol md>
                    <div className="d-flex justify-content-end flex-column">
                        <span className="text-decoration-line-through">PHP 4,000.97</span>
                        <h4>PHP 2,777.6</h4>
                        <CButton className="btn btn-primary mt-2">Continue booking</CButton>
                    </div>
                </CCol>
            </CRow>
        </CForm>
    )
}

export default Review

Review.propTypes = {
    form: PropTypes.object.isRequired,
    setForm: PropTypes.func.isRequired,
}
