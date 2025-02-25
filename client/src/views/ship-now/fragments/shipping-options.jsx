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

const ShippingOptions = ({ form, setForm }) => {
    const formRef = React.useRef(null)

    return (
        <CForm ref={formRef}>
            <h3 className="text-primary mt-4" id="shipment">
                Shipping
            </h3>
        </CForm>
    )
}

export default ShippingOptions

ShippingOptions.propTypes = {
    form: PropTypes.object.isRequired,
    setForm: PropTypes.func.isRequired,
}
