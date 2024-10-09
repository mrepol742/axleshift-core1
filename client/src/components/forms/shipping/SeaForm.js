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
    CFormSelect,
} from '@coreui/react'

const SeaForm = ({
    formData,
    handleInputChange,
    handleShipmentDetails,
    handleSubmit,
    isInfo,
    isDisabled,
}) => {
    return (
        <CForm>
            {!isInfo && <CProgress value={100} className="mb-3" variant="striped" animated />}
            <h3 className="mb-4">Shipping Information</h3>

            <CFormLabel htmlFor="shipping_loading_port">Loading Port</CFormLabel>
            <CFormInput
                type="text"
                id="shipping_loading_port"
                value={formData.shipping.shipping_loading_port}
                onChange={(e) => handleInputChange(e, 'shipping')}
                required
                className="mb-4"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="shipping_discharge_port">Discharge Port</CFormLabel>
            <CFormInput
                type="text"
                id="shipping_discharge_port"
                value={formData.shipping.shipping_discharge_port}
                onChange={(e) => handleInputChange(e, 'shipping')}
                required
                className="mb-4"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="shipping_sailing_date">Sailing Date</CFormLabel>
            <CFormInput
                type="date"
                id="shipping_sailing_date"
                value={formData.shipping.shipping_sailing_date}
                onChange={(e) => handleInputChange(e, 'shipping')}
                required
                className="mb-4"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="shipping_estimated_arrival_date">
                Estimated Arrival Date
            </CFormLabel>
            <CFormInput
                type="date"
                id="shipping_estimated_arrival_date"
                value={formData.shipping.shipping_estimated_arrival_date}
                onChange={(e) => handleInputChange(e, 'shipping')}
                required
                className="mb-4"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="shipping_cargo_type">Flight Type</CFormLabel>
            <CFormSelect
                id="shipping_cargo_type"
                value={formData.shipping.shipping_cargo_type}
                onChange={(e) => handleInputChange(e, 'shipping')}
                options={[
                    { label: 'Containerized Cargo', value: '1' },
                    { label: 'Bulk Cargo', value: '2' },
                    { label: 'Breakbulk Cargo', value: '3' },
                    { label: 'Reefer Cargo', value: '4' },
                    { label: 'RORO Cargo', value: '5' },
                    { label: 'Heavy Lift Cargo', value: '6' },
                ]}
                required
                className="mb-4"
                disabled={isDisabled}
            />

            {!isInfo && (
                <>
                    <CButton color="secondary" onClick={handleShipmentDetails}>
                        Back
                    </CButton>
                    <CButton color="primary" onClick={handleSubmit}>
                        Submit
                    </CButton>
                </>
            )}
        </CForm>
    )
}

SeaForm.propTypes = {
    formData: PropTypes.shape({
        shipping: PropTypes.shape({
            shipping_loading_port: PropTypes.string.isRequired,
            shipping_discharge_port: PropTypes.string.isRequired,
            shipping_sailing_date: PropTypes.string.isRequired,
            shipping_estimated_arrival_date: PropTypes.string.isRequired,
            shipping_cargo_type: PropTypes.number.isRequired,
        }).isRequired,
    }).isRequired,
    handleInputChange: PropTypes.func,
    handleShipmentDetails: PropTypes.func,
    handleSubmit: PropTypes.func,
    isInfo: PropTypes.bool,
    isDisabled: PropTypes.bool,
}

export default SeaForm
