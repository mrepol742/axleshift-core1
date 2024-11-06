import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import {
    CForm,
    CProgress,
    CFormLabel,
    CFormInput,
    CButton,
    CRow,
    CCol,
    CFormTextarea,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

const ShipmentForm = ({
    formData,
    handleInputChange,
    handleConsigneeInfo,
    handleShippingInformation,
    isInfo,
    isDisabled,
}) => {
    const formRef = useRef(null)

    return (
        <CForm ref={formRef}>
            {!isInfo && <CProgress value={75} className="mb-3" variant="striped" animated />}
            <h3 className="mb-4">Shipment Details</h3>

            <CFormLabel htmlFor="shipment_description">
                Description of Goods<span className="text-danger ms-1">*</span>
            </CFormLabel>
            <CFormInput
                type="text"
                id="shipment_description"
                value={formData.shipment.shipment_description}
                onChange={(e) => handleInputChange(e, 'shipment')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CRow className="mb-3">
                <h5>Dimensions (cm)</h5>
                <CCol xs>
                    <CFormLabel htmlFor="shipment_dimension_length">
                        Length<span className="text-danger ms-1">*</span>
                    </CFormLabel>
                    <CFormInput
                        type="number"
                        id="shipment_dimension_length"
                        value={formData.shipment.shipment_dimension_length}
                        onChange={(e) => handleInputChange(e, 'shipment')}
                        required
                        disabled={isDisabled}
                    />
                </CCol>
                <CCol xs>
                    <CFormLabel htmlFor="shipment_dimension_width">
                        Width<span className="text-danger ms-1">*</span>
                    </CFormLabel>
                    <CFormInput
                        type="number"
                        id="shipment_dimension_width"
                        value={formData.shipment.shipment_dimension_width}
                        onChange={(e) => handleInputChange(e, 'shipment')}
                        required
                        disabled={isDisabled}
                    />
                </CCol>
                <CCol xs>
                    <CFormLabel htmlFor="shipment_dimension_height">
                        Height<span className="text-danger ms-1">*</span>
                    </CFormLabel>
                    <CFormInput
                        type="number"
                        id="shipment_dimension_height"
                        value={formData.shipment.shipment_dimension_height}
                        onChange={(e) => handleInputChange(e, 'shipment')}
                        required
                        disabled={isDisabled}
                    />
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CCol xs>
                    <CFormLabel htmlFor="shipment_weight">
                        Weight (kg)<span className="text-danger ms-1">*</span>
                    </CFormLabel>
                    <CFormInput
                        type="number"
                        id="shipment_weight"
                        value={formData.shipment.shipment_weight}
                        onChange={(e) => handleInputChange(e, 'shipment')}
                        required
                        className="mb-3"
                        disabled={isDisabled}
                    />
                </CCol>
                <CCol xs>
                    <CFormLabel htmlFor="shipment_volume">
                        Total Volume<span className="text-danger ms-1">*</span>
                    </CFormLabel>
                    <CFormInput
                        type="number"
                        id="shipment_volume"
                        value={formData.shipment.shipment_volume}
                        onChange={(e) => handleInputChange(e, 'shipment')}
                        className="mb-3"
                        disabled={isDisabled}
                    />
                </CCol>
                <CCol xs>
                    <CFormLabel htmlFor="shipment_value">
                        Value of Goods<span className="text-danger ms-1">*</span>
                    </CFormLabel>
                    <CFormInput
                        type="number"
                        id="shipment_value"
                        value={formData.shipment.shipment_value}
                        onChange={(e) => handleInputChange(e, 'shipment')}
                        required
                        className="mb-3"
                        disabled={isDisabled}
                    />
                </CCol>
            </CRow>

            <CFormLabel htmlFor="shipment_instructions">Special Handling Instructions</CFormLabel>
            <CFormTextarea
                id="shipment_instructions"
                rows={3}
                value={formData.shipment.shipment_instructions}
                onChange={(e) => handleInputChange(e, 'shipment')}
                className="mb-3"
                disabled={isDisabled}
            ></CFormTextarea>

            {!isInfo && (
                <>
                    <CButton color="primary" onClick={handleConsigneeInfo}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </CButton>
                    <CButton
                        className="ms-2"
                        color="primary"
                        onClick={() => {
                            if (formRef.current.checkValidity()) {
                                handleShippingInformation()
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

ShipmentForm.propTypes = {
    formData: PropTypes.shape({
        shipment: PropTypes.shape({
            shipment_description: PropTypes.string.isRequired,
            shipment_weight: PropTypes.string.isRequired,
            shipment_dimension_length: PropTypes.string.isRequired,
            shipment_dimension_width: PropTypes.string.isRequired,
            shipment_dimension_height: PropTypes.string.isRequired,
            shipment_volume: PropTypes.string.isRequired,
            shipment_value: PropTypes.string.isRequired,
            shipment_instructions: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    handleInputChange: PropTypes.func,
    handleConsigneeInfo: PropTypes.func,
    handleShippingInformation: PropTypes.func,
    isInfo: PropTypes.bool,
    isDisabled: PropTypes.bool,
}

export default ShipmentForm
