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

const AirForm = ({
    formData,
    handleInputChange,
    handleShipmentDetails,
    handleSubmit,
    isInfo,
    isDisabled,
}) => {
    return (
        <CForm>
            {!isInfo && <CProgress value={100} />}
            <h3 className="mb-4">Shipping Information</h3>

            <CFormLabel htmlFor="shipping_origin_airport">Origin Airport</CFormLabel>
            <CFormInput
                type="text"
                id="shipping_origin_airport"
                value={formData.shipping.shipping_origin_airport}
                onChange={(e) => handleInputChange(e, 'shipping')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="shipping_destination_airport">Destination Airport</CFormLabel>
            <CFormInput
                type="text"
                id="shipping_destination_airport"
                value={formData.shipping.shipping_destination_airport}
                onChange={(e) => handleInputChange(e, 'shipping')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="shipping_preferred_departure_date">
                Preferred Departure Date
            </CFormLabel>
            <CFormInput
                type="date"
                id="shipping_preferred_departure_date"
                value={formData.shipping.shipping_preferred_departure_date}
                onChange={(e) => handleInputChange(e, 'shipping')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="shipping_preferred_arrival_date">
                Preferred Arrival Date
            </CFormLabel>
            <CFormInput
                type="date"
                id="shipping_preferred_arrival_date"
                value={formData.shipping.shipping_preferred_arrival_date}
                onChange={(e) => handleInputChange(e, 'shipping')}
                required
                className="mb-3"
                disabled={isDisabled}
            />

            <CFormLabel htmlFor="shipping_flight_type">Flight Type</CFormLabel>
            <CFormSelect
                id="shipping_flight_type"
                value={formData.shipping.shipping_flight_type}
                onChange={(e) => handleInputChange(e, 'shipping')}
                options={[
                    { label: 'Cargo-Only Flights', value: '1' },
                    { label: 'Passenger Flights with Cargo Holds', value: '2' },
                    { label: 'Charter Flights', value: '3' },
                    { label: 'Express Service', value: '4' },
                ]}
                required
                className="mb-3"
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

AirForm.propTypes = {
    formData: PropTypes.shape({
        shipping: PropTypes.shape({
            shipping_origin_airport: PropTypes.string.isRequired,
            shipping_destination_airport: PropTypes.string.isRequired,
            shipping_preferred_departure_date: PropTypes.string.isRequired,
            shipping_preferred_arrival_date: PropTypes.string.isRequired,
            shipping_flight_type: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    handleInputChange: PropTypes.func,
    handleShipmentDetails: PropTypes.func,
    handleSubmit: PropTypes.func,
    isInfo: PropTypes.bool,
    isDisabled: PropTypes.bool,
}

export default AirForm
