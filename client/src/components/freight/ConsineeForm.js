import React from 'react'
import PropTypes from 'prop-types'
import { CForm, CProgress, CFormLabel, CFormInput, CButton } from '@coreui/react'

const ConsineeForm = ({
    formData,
    handleInputChange,
    handleShipperInformation,
    handleShipmentDetails,
    isInfo,
}) => {
    return (
        <CForm>
            {!isInfo && <CProgress value={50} />}
            <h3 className="mb-4">Consignee Information</h3>

            <CFormLabel htmlFor="consignee_company_name">Company Name</CFormLabel>
            <CFormInput
                type="text"
                id="consignee_company_name"
                value={formData.consignee.consignee_company_name}
                onChange={(e) => handleInputChange(e, 'consignee')}
                required
                className="mb-3"
            />

            <CFormLabel htmlFor="consignee_contact_name">Contact Name</CFormLabel>
            <CFormInput
                type="text"
                id="consignee_contact_name"
                value={formData.consignee.consignee_contact_name}
                onChange={(e) => handleInputChange(e, 'consignee')}
                required
                className="mb-3"
            />

            <CFormLabel htmlFor="consignee_contact_email_address">Email Address</CFormLabel>
            <CFormInput
                type="text"
                id="consignee_contact_email_address"
                value={formData.consignee.consignee_contact_email_address}
                onChange={(e) => handleInputChange(e, 'consignee')}
                required
                className="mb-3"
            />

            <CFormLabel htmlFor="consignee_contact_phone_number">Phone Number</CFormLabel>
            <CFormInput
                type="text"
                id="consignee_contact_phone_number"
                value={formData.consignee.consignee_contact_phone_number}
                onChange={(e) => handleInputChange(e, 'consignee')}
                required
                className="mb-3"
            />

            <CFormLabel htmlFor="consignee_company_address">Address</CFormLabel>
            <CFormInput
                type="text"
                id="consignee_company_address"
                value={formData.consignee.consignee_company_address}
                onChange={(e) => handleInputChange(e, 'consignee')}
                required
                className="mb-3"
            />

            {!isInfo && (
                <>
                    <CButton color="secondary" onClick={handleShipperInformation}>
                        Back
                    </CButton>
                    <CButton color="primary" onClick={handleShipmentDetails}>
                        Next
                    </CButton>
                </>
            )}
        </CForm>
    )
}

ConsineeForm.propTypes = {
    formData: PropTypes.shape({
        consignee: PropTypes.shape({
            consignee_company_name: PropTypes.string.isRequired,
            consignee_contact_name: PropTypes.string.isRequired,
            consignee_contact_email_address: PropTypes.string.isRequired,
            consignee_contact_phone_number: PropTypes.string.isRequired,
            consignee_company_address: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    handleInputChange: PropTypes.func,
    handleShipperInformation: PropTypes.func,
    handleShipmentDetails: PropTypes.func,
    isInfo: PropTypes.bool,
}

export default ConsineeForm
