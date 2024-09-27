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
} from '@coreui/react'
import Cookies from 'js-cookie'
import ShipperForm from '../../../components/freight/ShipperForm'
import ConsineeForm from '../../../components/freight/ConsineeForm'
import ShipmentForm from '../../../components/freight/ShipmentForm'

const Sea = () => {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [disableSubmit, setDisableSubmit] = useState(false)
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
            shipping_loading_port: '',
            shipping_discharge_port: '',
            shipping_sailing_date: '',
            shipping_estimated_arrival_date: '',
            shipping_cargo_type: 1,
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
            setDisableSubmit(true)
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/freight/b/sea`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_SESSION)}`,
                    },
                },
            )
            if (response.data.status == 201) {
                alert('Data has been created')
                navigate('/')
            }
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
                    <h3 className="mb-4">Shipping Information</h3>

                    <CFormLabel htmlFor="shipping_loading_port">Loading Port</CFormLabel>
                    <CFormInput
                        type="text"
                        id="shipping_loading_port"
                        value={formData.shipping.shipping_loading_port}
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        required
                        className="mb-4"
                    />

                    <CFormLabel htmlFor="shipping_discharge_port">Discharge Port</CFormLabel>
                    <CFormInput
                        type="text"
                        id="shipping_discharge_port"
                        value={formData.shipping.shipping_discharge_port}
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        required
                        className="mb-4"
                    />

                    <CFormLabel htmlFor="shipping_sailing_date">Sailing Date</CFormLabel>
                    <CFormInput
                        type="date"
                        id="shipping_sailing_date"
                        value={formData.shipping.shipping_sailing_date}
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        required
                        className="mb-4"
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
                            { label: 'Dangerous Goods', value: '7' },
                        ]}
                        required
                        className="mb-4"
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

export default Sea
