import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { CForm, CProgress, CFormLabel, CFormInput, CButton } from '@coreui/react'

const ShipperForm = ({ formData, handleInputChange, handleConsigneeInfo, isInfo, isDisabled }) => {
    const formRef = useRef(null)

    return (
        <CForm ref={formRef}>
            {!isInfo && <CProgress value={25} className="mb-3" variant="striped" animated />}
            <h3 className="mb-4">Shipper Information</h3>

            <CFormLabel htmlFor="shipper_company_name">
                Company Name<span className="text-danger ms-1">*</span>
            </CFormLabel>
            <CFormInput
                type="text"
                id="shipper_company_name"
                value={formData.shipper.shipper_company_name}
                onChange={(e) => handleInputChange(e, 'shipper')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="shipper_contact_name">
                Contact Name<span className="text-danger ms-1">*</span>
            </CFormLabel>
            <CFormInput
                type="text"
                id="shipper_contact_name"
                value={formData.shipper.shipper_contact_name}
                onChange={(e) => handleInputChange(e, 'shipper')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="shipper_contact_email_address">
                Email Address<span className="text-danger ms-1">*</span>
            </CFormLabel>
            <CFormInput
                type="email"
                name="email"
                autoComplete="email"
                id="shipper_contact_email_address"
                value={formData.shipper.shipper_contact_email_address}
                onChange={(e) => handleInputChange(e, 'shipper')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="shipper_contact_phone_number">
                Phone Number<span className="text-danger ms-1">*</span>
            </CFormLabel>
            <CFormInput
                type="tel"
                autoComplete="tel"
                id="shipper_contact_phone_number"
                value={formData.shipper.shipper_contact_phone_number}
                onChange={(e) => handleInputChange(e, 'shipper')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="shipper_company_address">
                Address<span className="text-danger ms-1">*</span>
            </CFormLabel>
            <CFormInput
                type="text"
                id="shipper_company_address"
                value={formData.shipper.shipper_company_address}
                onChange={(e) => handleInputChange(e, 'shipper')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            {!isInfo && (
                <CButton
                    color="primary"
                    onClick={() => {
                        if (formRef.current.checkValidity()) {
                            handleConsigneeInfo()
                        } else {
                            formRef.current.reportValidity()
                        }
                    }}
                >
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
    isDisabled: PropTypes.bool,
}

export default ShipperForm
