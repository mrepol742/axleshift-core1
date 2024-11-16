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
import { useToast } from '../../components/AppToastProvider'
import errorMessages from '../../components/ErrorMessages'

const Air = () => {
    const navigate = useNavigate()
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
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
            shipment_weight: '',
            shipment_dimension_length: '',
            shipment_dimension_width: '',
            shipment_dimension_height: '',
            shipment_volume: '',
            shipment_value: '',
            shipment_instructions: '',
        },
        shipping: {
            shipping_origin_airport: '',
            shipping_destination_airport: '',
            shipping_preferred_departure_date: '',
            shipping_preferred_arrival_date: '',
            shipping_flight_type: '',
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
        setFormData((prev) => ({
            ...prev,
            recaptcha_ref: recaptcha,
        }))

        await axios
            .post(`${VITE_APP_API_URL}/api/v1/freight/b/air`, formData, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => alert('/'))
            .catch((error) => {
                console.error(error)
                const message = errorMessages[error.status] || 'Internal Application Error'
                addToast(message, 'Submit failed!')
            })
            .finally(() => setLoading(false))
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
                            handleConsigneeInfo={(e) => setCurrentPage(2)}
                        />
                    )}

                    {currentPage === 2 && (
                        <ConsineeForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleShipperInformation={(e) => setCurrentPage(1)}
                            handleShipmentDetails={(e) => setCurrentPage(3)}
                        />
                    )}

                    {currentPage === 3 && (
                        <ShipmentForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleConsigneeInfo={(e) => setCurrentPage(2)}
                            handleShippingInformation={(e) => setCurrentPage(4)}
                        />
                    )}

                    {currentPage === 4 && (
                        <AirForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleShipmentDetails={(e) => setCurrentPage(3)}
                            handleSubmit={handleSubmit}
                        />
                    )}
                </CCol>
            </CRow>
        </>
    )
}

export default Air
