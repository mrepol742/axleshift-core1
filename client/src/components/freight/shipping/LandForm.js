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

const LandForm = ({
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

            <CFormLabel htmlFor="shipping_origin_addresss">Origin Address</CFormLabel>
            <CFormInput
                type="text"
                id="shipping_origin_addresss"
                value={formData.shipping.shipping_origin_addresss}
                onChange={(e) => handleInputChange(e, 'shipping')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="shipping_destination_address">Destination Address</CFormLabel>
            <CFormInput
                type="text"
                id="shipping_destination_address"
                value={formData.shipping.shipping_destination_address}
                onChange={(e) => handleInputChange(e, 'shipping')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="shipping_pickup_date">Pickup Date</CFormLabel>
            <CFormInput
                type="date"
                id="shipping_pickup_date"
                value={formData.shipping.shipping_pickup_date}
                onChange={(e) => handleInputChange(e, 'shipping')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="shipping_delivery_date">Delivery Date</CFormLabel>
            <CFormInput
                type="date"
                id="shipping_delivery_date"
                value={formData.shipping.shipping_delivery_date}
                onChange={(e) => handleInputChange(e, 'shipping')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="shipping_vehicle_type">Vehicle Type</CFormLabel>
            <CFormSelect
                id="shipping_vehicle_type"
                value={formData.shipping.shipping_vehicle_type}
                onChange={(e) => handleInputChange(e, 'shipping')}
                options={[
                    { label: 'Truck', value: '1' },
                    { label: 'Van', value: '2' },
                    { label: 'Trailers', value: '3' },
                    { label: 'Buses', value: '4' },
                    { label: 'Motorcycles', value: '5' },
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

LandForm.propTypes = {
    formData: PropTypes.shape({
        shipping: PropTypes.shape({
            shipping_origin_addresss: PropTypes.string.isRequired,
            shipping_destination_address: PropTypes.string.isRequired,
            shipping_pickup_date: PropTypes.string.isRequired,
            shipping_delivery_date: PropTypes.string.isRequired,
            shipping_vehicle_type: PropTypes.number.isRequired,
        }).isRequired,
    }).isRequired,
    handleInputChange: PropTypes.func,
    handleShipmentDetails: PropTypes.func,
    handleSubmit: PropTypes.func,
    isInfo: PropTypes.bool,
    isDisabled: PropTypes.bool,
}

export default LandForm
