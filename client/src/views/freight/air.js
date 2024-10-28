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
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_API_URL, VITE_APP_SESSION } from '../../config'
import ShipperForm from '../../components/forms/ShipperForm'
import ConsineeForm from '../../components/forms/ConsineeForm'
import ShipmentForm from '../../components/forms/ShipmentForm'
import AirForm from '../../components/forms/shipping/AirForm'

const Air = () => {
    const navigate = useNavigate()
    const recaptchaRef = React.useRef()
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
            shipping_flight_type: 1,
        },
        recaptcha_ref: '',
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
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()
        const formDataToSend = new FormData()
        for (const key in formData) {
            formDataToSend.append(key, formData[key])
        }
        formDataToSend.append('recaptcha_ref', recaptcha)
        for (const key in formDataToSend) {
            console.log(key, formDataToSend[key])
        }
        await axios
            .post(`${VITE_APP_API_URL}/api/v1/freight/b/air`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => navigate('/'))
            .catch((error) => {
                console.error(error)
            })
            .finally(() => setLoading(false))
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
            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_APP_RECAPTCHA_SITE_KEY} />
            <CRow className="mb-4">
                <CCol xs={3} md={5} xl={3} className="image-container d-none d-md-flex">
                    <CImage fluid rounded src="/images/freight-air.jpg" className="custom-image" />
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
                        <AirForm
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

export default Air
