import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_API_URL, VITE_APP_SESSION } from '../../config'
import ShipperForm from '../../components/forms/ShipperForm'
import ConsineeForm from '../../components/forms/ConsineeForm'
import ShipmentForm from '../../components/forms/ShipmentForm'
import LandForm from '../../components/forms/shipping/LandForm'

const Land = () => {
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
            shipping_origin_addresss: '',
            shipping_destination_address: '',
            shipping_pickup_date: '',
            shipping_delivery_date: '',
            shipping_vehicle_type: 0,
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
        await axios
            .post(`${VITE_APP_API_URL}/api/v1/freight/b/land`, formData, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => {
                navigate('/')
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setLoading(false)
            })
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
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}
            <CRow className="mb-4">
                <CCol xs={3} md={5} xl={3} className="image-container d-none d-md-flex">
                    <CImage fluid rounded src="/images/freight-land.jpg" className="custom-image" />
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
                        <LandForm
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

export default Land
