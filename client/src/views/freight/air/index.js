import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    CSpinner,
} from '@coreui/react'
import Cookies from 'js-cookie'
import ShipperForm from '../../../components/freight/ShipperForm'
import ConsineeForm from '../../../components/freight/ConsineeForm'
import ShipmentForm from '../../../components/freight/ShipmentForm'

const Air = () => {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
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
            shipment_weight: 0,
            shipment_dimension_length: 0,
            shipment_dimension_width: 0,
            shipment_dimension_height: 0,
            shipment_volume: 0,
            shipment_value: 0,
            shipment_instructions: '',
        },
        shipping: {
            shipping_origin_airport: '',
            shipping_destination_airport: '',
            shipping_preferred_departure_date: '',
            shipping_preferred_arrival_date: '',
            shipping_flight_type: '1',
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
            setLoading(true)
            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_URL}/api/freight/b/air`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_APP_SESSION)}`,
                    },
                },
            )
            if (response.status == 201) navigate('/')
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
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
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}

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
                    <h3 className="mb-4">Shipping Information</h3>

                    <CFormLabel htmlFor="shipping_origin_airport">Origin Airport</CFormLabel>
                    <CFormInput
                        type="text"
                        id="shipping_origin_airport"
                        value={formData.shipping.shipping_origin_airport}
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        required
                        className="mb-3"
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
                        className="mb-3"
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
                    />
                    <CButton color="secondary" onClick={handleShipmentDetails}>
                        Back
                    </CButton>
                    <CButton color="primary" onClick={handleSubmit} disabled={disableSubmit}>
                        Submit
                    </CButton>
                </CForm>
            )}
        </>
    )
}

export default Air
