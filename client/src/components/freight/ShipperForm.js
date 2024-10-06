import React from 'react'
import PropTypes from 'prop-types'
import { CForm, CProgress, CFormLabel, CFormInput, CButton } from '@coreui/react'

const ShipperForm = ({ formData, handleInputChange, handleConsigneeInfo, isInfo }) => {
    return (
        <CForm>
            {!isInfo && <CProgress value={25} />}
            <h3 className="mb-4">Shipper Information</h3>

            <CFormLabel htmlFor="shipper_company_name">Company Name</CFormLabel>
            <CFormInput
                type="text"
                id="shipper_company_name"
                value={formData.shipper.shipper_company_name}
                onChange={(e) => handleInputChange(e, 'shipper')}
                required
                className="mb-3"
            />

            <CFormLabel htmlFor="shipper_contact_name">Contact Name</CFormLabel>
            <CFormInput
                type="text"
                id="shipper_contact_name"
                value={formData.shipper.shipper_contact_name}
                onChange={(e) => handleInputChange(e, 'shipper')}
                required
                className="mb-3"
            />

            <CFormLabel htmlFor="shipper_contact_email_address">Email Address</CFormLabel>
            <CFormInput
                type="text"
                id="shipper_contact_email_address"
                value={formData.shipper.shipper_contact_email_address}
                onChange={(e) => handleInputChange(e, 'shipper')}
                required
                className="mb-3"
            />

            <CFormLabel htmlFor="shipper_contact_phone_number">Phone Number</CFormLabel>
            <CFormInput
                type="text"
                id="shipper_contact_phone_number"
                value={formData.shipper.shipper_contact_phone_number}
                onChange={(e) => handleInputChange(e, 'shipper')}
                required
                className="mb-3"
            />

            <CFormLabel htmlFor="shipper_company_address">Address</CFormLabel>
            <CFormInput
                type="text"
                id="shipper_company_address"
                value={formData.shipper.shipper_company_address}
                onChange={(e) => handleInputChange(e, 'shipper')}
                required
                className="mb-3"
            />

            {!isInfo && (
                <CButton color="primary" onClick={handleConsigneeInfo}>
                    Next
                </CButton>
            )}
        </CForm>
    )
}

ShipperForm.propTypes = {
    formData: PropTypes.shape({
        shipper: PropTypes.shape({
            shipper_company_name: PropTypes.string.isRequired,
            shipper_contact_name: PropTypes.string.isRequired,
            shipper_contact_email_address: PropTypes.string.isRequired,
            shipper_contact_phone_number: PropTypes.string.isRequired,
            shipper_company_address: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    handleInputChange: PropTypes.func,
    handleConsigneeInfo: PropTypes.func,
    isInfo: PropTypes.bool,
}

export default ShipperForm
