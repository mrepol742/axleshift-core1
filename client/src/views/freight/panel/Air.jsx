import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CRow,
    CCol,
    CButton,
    CSpinner,
    CImage,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
} from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY } from '../../../config'
import ShipperForm from '../../../components/forms/ShipperForm'
import ConsineeForm from '../../../components/forms/ConsineeForm'
import ShipmentForm from '../../../components/forms/ShipmentForm'
import AirForm from '../../../components/forms/shipping/AirForm'
import { useToast } from '../../../components/AppToastProvider'
import errorMessages from '../../../utils/ErrorMessages'

const Air = () => {
    const navigate = useNavigate()
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [confirmation, setConfirmation] = useState(false)
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
        if (!confirmation) return setConfirmation(true)
        const recaptcha = await recaptchaRef.current.executeAsync()
        setLoading(true)
        const updatedFormData = {
            ...formData,
            recaptcha_ref: recaptcha,
        }
        axios
            .post(`/freight/b/air`, updatedFormData)
            .then((response) => {
                addToast('Shipment has been created.', 'Shipment')
                navigate('/dashboard')
            })
            .catch((error) => {
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
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
            {confirmation && (
                <CModal
                    visible={true}
                    onClose={() => setConfirmation(false)}
                    alignment="center"
                    scrollable
                >
                    <CModalHeader closeButton>Shipment Confirmation</CModalHeader>
                    <CModalBody>
                        Do you confirm that the details you input are correct and accurate?
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="primary" onClick={handleSubmit}>
                            Confirm
                        </CButton>
                    </CModalFooter>
                </CModal>
            )}
            <CRow className="mb-4">
                <CCol xs={3} md={5} xl={3} className="image-container d-none d-md-flex">
                    <CImage
                        fluid
                        rounded
                        src="/images/freight-air.jpg"
                        className="custom-image"
                        loading="lazy"
                    />
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
