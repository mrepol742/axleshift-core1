import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { CForm, CProgress, CFormLabel, CFormInput, CButton } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

const ConsineeForm = ({
    formData,
    handleInputChange,
    handleShipperInformation,
    handleShipmentDetails,
    isInfo,
    isDisabled,
}) => {
    const formRef = useRef(null)

    return (
        <CForm ref={formRef}>
            {!isInfo && <CProgress value={50} className="mb-3" variant="striped" animated />}
            <h3 className="mb-4">Consignee Information</h3>

            <CFormLabel htmlFor="consignee_company_name">
                Company Name<span className="text-danger ms-1">*</span>
            </CFormLabel>
            <CFormInput
                type="text"
                id="consignee_company_name"
                value={formData.consignee.consignee_company_name}
                onChange={(e) => handleInputChange(e, 'consignee')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="consignee_contact_name">
                Contact Name<span className="text-danger ms-1">*</span>
            </CFormLabel>
            <CFormInput
                type="text"
                id="consignee_contact_name"
                value={formData.consignee.consignee_contact_name}
                onChange={(e) => handleInputChange(e, 'consignee')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="consignee_contact_email_address">
                Email Address<span className="text-danger ms-1">*</span>
            </CFormLabel>
            <CFormInput
                type="email"
                name="email"
                autoComplete="email"
                id="consignee_contact_email_address"
                value={formData.consignee.consignee_contact_email_address}
                onChange={(e) => handleInputChange(e, 'consignee')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="consignee_contact_phone_number">
                Phone Number<span className="text-danger ms-1">*</span>
            </CFormLabel>
            <CFormInput
                type="tel"
                autoComplete="tel"
                id="consignee_contact_phone_number"
                value={formData.consignee.consignee_contact_phone_number}
                onChange={(e) => handleInputChange(e, 'consignee')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="consignee_company_address">
                Address<span className="text-danger ms-1">*</span>
            </CFormLabel>
            <CFormInput
                type="text"
                id="consignee_company_address"
                value={formData.consignee.consignee_company_address}
                onChange={(e) => handleInputChange(e, 'consignee')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            {!isInfo && (
                <>
                    <CButton color="primary" onClick={handleShipperInformation}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </CButton>
                    <CButton
                        className="ms-2"
                        color="primary"
                        onClick={() => {
                            if (formRef.current.checkValidity()) {
                                handleShipmentDetails()
                            } else {
                                formRef.current.reportValidity()
                            }
                        }}
                    >
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
    isDisabled: PropTypes.bool,
}

export default ConsineeForm
