import React, { useState } from 'react'
import axios from 'axios'
import {
    CForm,
    CFormLabel,
    CFormInput,
    CRow,
    CCol,
    CFormTextarea,
    CCard,
    CCardBody,
    CCardTitle,
    CButton,
    CProgress,
    CFormSelect,
} from '@coreui/react'
import ShipperForm from '../../../components/freight/ShipperForm'
import ConsineeForm from '../../../components/freight/ConsineeForm'
import ShipmentForm from '../../../components/freight/ShipmentForm'

const FLand = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [formData, setFormData] = useState({
        shipper: {
            shipper_company_name: '',
            shipper_contact_name: '',
            shipper_contact_email_address: '',
            shipper_contact_phone_number: '',
            shipper_company_address: '',
        },
        consignee: {
            consignee_company_name: '',
            consignee_contact_name: '',
            consignee_contact_email_address: '',
            consignee_contact_phone_number: '',
            consignee_company_address: '',
        },
        shipment: {
            shipment_description: '',
            shipment_weight: '',
            shipment_dimension_length: '',
            shipment_dimension_width: '',
            shipment_dimension_height: '',
            shipment_volume: '',
            shipment_value: '',
            shipment_instructions: '',
        },
        shipping: {
            shipping_origin_addresss: '',
            shipping_destination_address: '',
            shipping_pickup_date: '',
            shipping_delivery_date: '',
            shipping_vehicle_type: '',
        },
    })

    const handleInputChange = (e, section) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [id]: value,
            },
        }))
    }

    const handleSubmit = async () => {
        try {
            alert(JSON.stringify(formData))
            //const response = await axios.post('http://localhost:5050/api/freight/add', formData)
            //alert(JSON.stringify(response.data))
        } catch (error) {
            console.error(error)
        }
    }

    const handleShipperInformation = () => {
        setCurrentPage(1)
    }

    const handleConsigneeInfo = () => {
        const { shipper } = formData
        if (Object.values(shipper).every((field) => field.trim() !== '')) return setCurrentPage(2)
        alert('Please fill in all required fields in Shipper Information.')
    }

    const handleShipmentDetails = () => {
        const { consignee } = formData
        if (Object.values(consignee).every((field) => field.trim() !== '')) return setCurrentPage(3)
        alert('Please fill in all required fields in Consignee Information.')
    }

    const handleShippingInformation = () => {
        const { shipment } = formData
        if (Object.values(shipment).every((field) => field.trim() !== '')) return setCurrentPage(4)
        alert('Please fill in all required fields in Shipment Details.')
    }

    return (
        <>
            {currentPage === 1 && (
                <ShipperForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleConsigneeInfo={handleConsigneeInfo}
                />
            )}

            {currentPage === 2 && (
                <ConsineeForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleShipperInformation={handleShipperInformation}
                    handleShipmentDetails={handleShipmentDetails}
                />
            )}

            {currentPage === 3 && (
                <ShipmentForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleConsigneeInfo={handleConsigneeInfo}
                    handleShippingInformation={handleShippingInformation}
                />
            )}

            {currentPage === 4 && (
                <CForm>
                    <CProgress value={100} />
                    <h3>Shipping Information</h3>
                    <CFormLabel htmlFor="shipping_origin_airport">Origin Airport</CFormLabel>
                    <CFormInput
                        type="text"
                        id="shipping_origin_airport"
                        value={formData.shipping.shipping_origin_airport}
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        required
                    />

                    <CFormLabel htmlFor="shipping_destination_airport">
                        Destination Airport
                    </CFormLabel>
                    <CFormInput
                        type="text"
                        id="shipping_destination_airport"
                        value={formData.shipping.shipping_destination_airport}
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        required
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
                    />

                    <CFormLabel htmlFor="shipping_flight_type">Flight Type</CFormLabel>
                    <CFormSelect
                        id="shipping_flight_type"
                        value={formData.shipping.shipping_flight_type}
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        options={[
                            { label: 'Direct', value: '1' },
                            { label: 'Multi-stop', value: '2' },
                        ]}
                        required
                    />
                    <CButton color="secondary" onClick={handleShipmentDetails}>
                        Back
                    </CButton>
                    <CButton color="primary" onClick={handleSubmit}>
                        Submit
                    </CButton>
                </CForm>
            )}
        </>
    )
}

export default FLand
