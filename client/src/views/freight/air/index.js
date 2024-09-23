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

const FAir = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [formData, setFormData] = useState({
        shipper: {},
        consignee: {},
        shipment: {},
        shipping: {},
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
            const response = await axios.post('http://localhost:5050/api/freight/add', formData)
            alert(JSON.stringify(response.data))
        } catch (error) {
            console.error(error)
        }
    }

    const handleShipperInformation = () => {
        setCurrentPage(1)
    }

    const handleConsigneeInfo = () => {
        setCurrentPage(2)
    }

    const handleShipmentDetails = () => {
        setCurrentPage(3)
    }

    const handleShippingInformation = () => {
        setCurrentPage(4)
    }

    return (
        <>
            {currentPage === 1 && (
                <CForm>
                    <CProgress value={25} />
                    <h3>Shipper Information</h3>
                    <CFormLabel htmlFor="shipper_company_name">Company Name</CFormLabel>
                    <CFormInput
                        type="text"
                        id="shipper_company_name"
                        onChange={(e) => handleInputChange(e, 'shipper')}
                    />

                    <CFormLabel htmlFor="shipper_contact_name">Contact Name</CFormLabel>
                    <CFormInput
                        type="text"
                        id="shipper_contact_name"
                        onChange={(e) => handleInputChange(e, 'shipper')}
                    />

                    <CFormLabel htmlFor="shipper_contact_email_address">Email Address</CFormLabel>
                    <CFormInput
                        type="text"
                        id="shipper_contact_email_address"
                        onChange={(e) => handleInputChange(e, 'shipper')}
                    />

                    <CFormLabel htmlFor="shipper_contact_phone_number">Phone Number</CFormLabel>
                    <CFormInput
                        type="text"
                        id="shipper_contact_phone_number"
                        onChange={(e) => handleInputChange(e, 'shipper')}
                    />

                    <CFormLabel htmlFor="shipper_company_address">Address</CFormLabel>
                    <CFormInput
                        type="text"
                        id="shipper_company_address"
                        onChange={(e) => handleInputChange(e, 'shipper')}
                    />

                    <CButton color="primary" onClick={handleConsigneeInfo}>
                        Next
                    </CButton>
                </CForm>
            )}

            {currentPage === 2 && (
                <CForm>
                    <CProgress value={50} />
                    <h3>Consignee Information</h3>
                    <CFormLabel htmlFor="consignee_company_name">Company Name</CFormLabel>
                    <CFormInput
                        type="text"
                        id="consignee_company_name"
                        onChange={(e) => handleInputChange(e, 'consignee')}
                    />

                    <CFormLabel htmlFor="consignee_contact_name">Contact Name</CFormLabel>
                    <CFormInput
                        type="text"
                        id="consignee_contact_name"
                        onChange={(e) => handleInputChange(e, 'consignee')}
                    />

                    <CFormLabel htmlFor="consignee_contact_email_address">Email Address</CFormLabel>
                    <CFormInput
                        type="text"
                        id="consignee_contact_email_address"
                        onChange={(e) => handleInputChange(e, 'consignee')}
                    />

                    <CFormLabel htmlFor="consignee_contact_phone_number">Phone Number</CFormLabel>
                    <CFormInput
                        type="text"
                        id="consignee_contact_phone_number"
                        onChange={(e) => handleInputChange(e, 'consignee')}
                    />

                    <CFormLabel htmlFor="consignee_company_address">Address</CFormLabel>
                    <CFormInput
                        type="text"
                        id="consignee_company_address"
                        onChange={(e) => handleInputChange(e, 'consignee')}
                    />

                    <CButton color="secondary" onClick={handleShipperInformation}>
                        Back
                    </CButton>
                    <CButton color="primary" onClick={handleShipmentDetails}>
                        Next
                    </CButton>
                </CForm>
            )}

            {currentPage === 3 && (
                <CForm>
                    <CProgress value={75} />
                    <h3>Shipment Details</h3>
                    <CFormLabel htmlFor="description">Description of Goods</CFormLabel>
                    <CFormInput
                        type="text"
                        id="description"
                        onChange={(e) => handleInputChange(e, 'shipment')}
                    />

                    <CFormLabel htmlFor="weight">Weight (kg)</CFormLabel>
                    <CFormInput
                        type="number"
                        id="weight"
                        onChange={(e) => handleInputChange(e, 'shipment')}
                    />

                    <CRow>
                        <h5>Dimensions (cm)</h5>
                        <CCol xs>
                            <CFormLabel htmlFor="length">Length</CFormLabel>
                            <CFormInput
                                type="number"
                                id="length"
                                onChange={(e) => handleInputChange(e, 'shipment')}
                            />
                        </CCol>
                        <CCol xs>
                            <CFormLabel htmlFor="width">Width</CFormLabel>
                            <CFormInput
                                type="number"
                                id="width"
                                onChange={(e) => handleInputChange(e, 'shipment')}
                            />
                        </CCol>
                        <CCol xs>
                            <CFormLabel htmlFor="height">Height</CFormLabel>
                            <CFormInput
                                type="number"
                                id="height"
                                onChange={(e) => handleInputChange(e, 'shipment')}
                            />
                        </CCol>
                    </CRow>

                    <CFormLabel htmlFor="volume">Total Volume (if applicable)</CFormLabel>
                    <CFormInput
                        type="number"
                        id="volume"
                        onChange={(e) => handleInputChange(e, 'shipment')}
                    />

                    <CFormLabel htmlFor="value">Value of Goods</CFormLabel>
                    <CFormInput
                        type="number"
                        id="value"
                        onChange={(e) => handleInputChange(e, 'shipment')}
                    />

                    <CFormLabel htmlFor="instructions">
                        Special Handling Instructions (if any)
                    </CFormLabel>
                    <CFormTextarea
                        id="instructions"
                        rows={3}
                        onChange={(e) => handleInputChange(e, 'shipment')}
                    ></CFormTextarea>

                    <CButton color="secondary" onClick={handleConsigneeInfo}>
                        Back
                    </CButton>
                    <CButton color="primary" onClick={handleShippingInformation}>
                        Next
                    </CButton>
                </CForm>
            )}

            {currentPage === 4 && (
                <CForm>
                    <CProgress value={100} />
                    <h3>Shipping Information</h3>
                    <CFormLabel htmlFor="origin_airport">Origin Airport</CFormLabel>
                    <CFormInput
                        type="text"
                        id="origin_airport"
                        onChange={(e) => handleInputChange(e, 'shipping')}
                    />

                    <CFormLabel htmlFor="destination_airport">Destination Airport</CFormLabel>
                    <CFormInput
                        type="text"
                        id="destination_airport"
                        onChange={(e) => handleInputChange(e, 'shipping')}
                    />

                    <CFormLabel htmlFor="preferred_departure_date">
                        Preferred Departure Date
                    </CFormLabel>
                    <CFormInput
                        type="date"
                        id="preferred_departure_date"
                        onChange={(e) => handleInputChange(e, 'shipping')}
                    />

                    <CFormLabel htmlFor="preferred_arrival_date">Preferred Arrival Date</CFormLabel>
                    <CFormInput
                        type="date"
                        id="preferred_arrival_date"
                        onChange={(e) => handleInputChange(e, 'shipping')}
                    />

                    <CFormLabel htmlFor="flight_type">Flight Type</CFormLabel>
                    <CFormSelect
                        id="flight_type"
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        options={[
                            { label: 'Direct', value: '1' },
                            { label: 'Multi-stop', value: '2' },
                        ]}
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

export default FAir
