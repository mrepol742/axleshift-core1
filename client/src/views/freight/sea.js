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
    CImage,
} from '@coreui/react'
import Cookies from 'js-cookie'
import ShipperForm from '../../components/forms/ShipperForm'
import ConsineeForm from '../../components/forms/ConsineeForm'
import ShipmentForm from '../../components/forms/ShipmentForm'
import SeaForm from '../../components/forms/shipping/SeaForm'

const Sea = () => {
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
            setLoading(true)
            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_URL}/api/v1/freight/b/sea`,
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
            <CRow className="mb-4">
                <CCol xs={3} className="image-container d-none d-md-flex">
                    <CImage fluid rounded src="/images/freight-sea.jpg" className="custom-image" />
                </CCol>
                <CCol md={7}>
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
                        <SeaForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleShipmentDetails={handleShipmentDetails}
                            handleSubmit={handleSubmit}
                        />
                    )}
                </CCol>
            </CRow>
        </>
    )
}

export default Sea
