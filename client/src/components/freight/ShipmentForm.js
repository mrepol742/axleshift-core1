import React from 'react'
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

const ShipmentForm = ({
    formData,
    handleInputChange,
    handleConsigneeInfo,
    handleShippingInformation,
}) => {
    return (
        <CForm>
            <CProgress value={75} />
            <h3>Shipment Details</h3>
            <CFormLabel htmlFor="shipment_description">Description of Goods</CFormLabel>
            <CFormInput
                type="text"
                id="shipment_description"
                value={formData.shipment.shipment_description}
                onChange={(e) => handleInputChange(e, 'shipment')}
                required
            />

            <CFormLabel htmlFor="shipment_weight">Weight (kg)</CFormLabel>
            <CFormInput
                type="number"
                id="shipment_weight"
                value={formData.shipment.shipment_weight}
                onChange={(e) => handleInputChange(e, 'shipment')}
                required
            />

            <CRow>
                <h5>Dimensions (cm)</h5>
                <CCol xs>
                    <CFormLabel htmlFor="shipment_dimension_length">Length</CFormLabel>
                    <CFormInput
                        type="number"
                        id="shipment_dimension_length"
                        value={formData.shipment.shipment_dimension_length}
                        onChange={(e) => handleInputChange(e, 'shipment')}
                        required
                    />
                </CCol>
                <CCol xs>
                    <CFormLabel htmlFor="shipment_dimension_width">Width</CFormLabel>
                    <CFormInput
                        type="number"
                        id="shipment_dimension_width"
                        value={formData.shipment.shipment_dimension_width}
                        onChange={(e) => handleInputChange(e, 'shipment')}
                        required
                    />
                </CCol>
                <CCol xs>
                    <CFormLabel htmlFor="shipment_dimension_height">Height</CFormLabel>
                    <CFormInput
                        type="number"
                        id="shipment_dimension_height"
                        value={formData.shipment.shipment_dimension_height}
                        onChange={(e) => handleInputChange(e, 'shipment')}
                        required
                    />
                </CCol>
            </CRow>

            <CFormLabel htmlFor="shipment_volume">Total Volume (if applicable)</CFormLabel>
            <CFormInput
                type="number"
                id="shipment_volume"
                value={formData.shipment.shipment_volume}
                onChange={(e) => handleInputChange(e, 'shipment')}
            />

            <CFormLabel htmlFor="shipment_value">Value of Goods</CFormLabel>
            <CFormInput
                type="number"
                id="shipment_value"
                value={formData.shipment.shipment_value}
                onChange={(e) => handleInputChange(e, 'shipment')}
                required
            />

            <CFormLabel htmlFor="shipment_instructions">
                Special Handling Instructions (if any)
            </CFormLabel>
            <CFormTextarea
                id="shipment_instructions"
                rows={3}
                value={formData.shipment.shipment_instructions}
                onChange={(e) => handleInputChange(e, 'shipment')}
            ></CFormTextarea>

            <CButton color="secondary" onClick={handleConsigneeInfo}>
                Back
            </CButton>
            <CButton color="primary" onClick={handleShippingInformation}>
                Next
            </CButton>
        </CForm>
    )
}

ShipmentForm.propTypes = {
    formData: PropTypes.shape({
        shipment: PropTypes.shape({
            shipment_description: PropTypes.string.isRequired,
            shipment_weight: PropTypes.number.isRequired,
            shipment_dimension_length: PropTypes.number.isRequired,
            shipment_dimension_width: PropTypes.number.isRequired,
            shipment_dimension_height: PropTypes.number.isRequired,
            shipment_volume: PropTypes.number.isRequired,
            shipment_value: PropTypes.number.isRequired,
            shipment_instructions: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleConsigneeInfo: PropTypes.func.isRequired,
    handleShippingInformation: PropTypes.func.isRequired,
}

export default ShipmentForm
