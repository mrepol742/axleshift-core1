import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    CCol,
    CRow,
    CSpinner,
    CButton,
    CButtonGroup,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode } from '@fortawesome/free-solid-svg-icons'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY } from '../../config'
import ShipperForm from '../../components/forms/ShipperForm'
import ConsineeForm from '../../components/forms/ConsineeForm'
import ShipmentForm from '../../components/forms/ShipmentForm'
import AirForm from '../../components/forms/shipping/AirForm'
import LandForm from '../../components/forms/shipping/LandForm'
import SeaForm from '../../components/forms/shipping/SeaForm'
import { useToast } from '../../components/AppToastProvider'
import errorMessages from '../../utils/ErrorMessages'

const FreightInfo = () => {
    const dataF = {
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
        recaptcha_ref: '',
    }
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const [formData, setFormData] = useState(dataF)
    const [editedFormData, setEditedFormData] = useState(dataF)
    const [type, setType] = useState('')
    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [error, setError] = useState(false)
    const [showQR, setShowQR] = useState(false)
    const svgRef = useRef(null)
    const navigate = useNavigate()
    const { id } = useParams()

    const handleInputChange = (e, section) => {
        const { id, value } = e.target
        setEditedFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [id]: value,
            },
        }))
    }

    const bookShipment = async () => {
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()
        axios
            .post(`/invoices`, {
                id: id,
                recaptcha_ref: recaptcha,
            })
            .then((response) => (window.location.href = response.data.r_url))
            .catch((error) => {
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    const fetchData = async () => {
        setLoading(true)
        axios
            .get(`/freight/${id}`)
            .then((response) => {
                setType(response.data.data.type)
                setStatus(response.data.data.status)
                setFormData(response.data.data.data)
                setEditedFormData(response.data.data.data)
            })
            .catch((error) => {
                console.error(error)
                setError(true)
            })
            .finally(() => setLoading(false))
    }

    const handleEditButton = async () => {
        if (disabled) return setDisabled(false)
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()
        const updatedFormData = {
            ...editedFormData,
            recaptcha_ref: recaptcha,
        }

        axios
            .post(`/freight/u/${type}/${id}`, updatedFormData)
            .then((response) => addToast('Your changes has been saved.'))
            .catch((error) => {
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message, 'Submit failed!')
                setEditedFormData(formData)
            })
            .finally(() => {
                setLoading(false)
                setDisabled(true)
            })
    }

    const handleDeleteButton = async () => {
        if (!disabled) {
            setDisabled(true)
            setEditedFormData(formData)
            return
        }
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()
        axios
            .post(`/freight/c/${id}`, { recaptcha_ref: recaptcha })
            .then((response) => {
                addToast('Shipment has been cancelled.')
                navigate('/dashboard')
            })
            .catch((error) => {
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message, 'Submit failed!')
                setEditedFormData(formData)
            })
            .finally(() => setLoading(false))
    }

    const handleQRDownload = () => {
        setShowQR(false)
        html2canvas(svgRef.current, { useCORS: true }).then((canvas) => {
            const imageURL = canvas.toDataURL('image/png')

            const link = document.createElement('a')
            link.href = imageURL
            link.download = 'qrcode.png'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        })
    }

    const renderForm = () => {
        switch (type) {
            case 'air':
                return <AirForm isInfo={true} formData={formData} isDisabled={true} />
            case 'land':
                return <LandForm isInfo={true} formData={formData} isDisabled={true} />
            case 'sea':
                return <SeaForm isInfo={true} formData={formData} isDisabled={true} />
            default:
                return null
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // i tried to resuse them like how she re--use u
    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}

            {error && (
                <CRow className="justify-content-center my-5">
                    <CCol md={6}>
                        <div className="clearfix">
                            <h1 className="float-start display-3 me-4">OOPS</h1>
                            <h4>There was no shipment found.</h4>
                            <p>Double check tracking id for any mistake.</p>
                        </div>
                    </CCol>
                </CRow>
            )}

            {!error && (
                <>
                    {showQR && (
                        <CModal
                            visible={true}
                            onClose={() => setShowQR(false)}
                            alignment="center"
                            scrollable
                        >
                            <CModalHeader closeButton></CModalHeader>
                            <CModalBody>
                                <div className="d-flex justify-content-center align-items-center">
                                    <div ref={svgRef} className="d-inline-block">
                                        <QRCodeSVG value={id} />
                                    </div>
                                </div>
                            </CModalBody>
                            <CModalFooter className="d-flex justify-content-center align-items-center">
                                <CButton color="primary" onClick={handleQRDownload}>
                                    Download
                                </CButton>
                            </CModalFooter>
                        </CModal>
                    )}
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        size="invisible"
                        sitekey={VITE_APP_RECAPTCHA_SITE_KEY}
                    />
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4">
                        <span className="d-block">#{id}</span>
                        <CButtonGroup className="mb-2 mb-sm-0">
                            <CButton
                                color="primary"
                                className="me-2 rounded"
                                onClick={(e) => setShowQR(true)}
                            >
                                <FontAwesomeIcon icon={faQrcode} />
                            </CButton>
                            {status !== 'cancelled' && status !== 'delivered' && (
                                <>
                                    {status === 'to_pay' && (
                                        <CButton
                                            color="primary"
                                            className="me-2 rounded"
                                            onClick={bookShipment}
                                        >
                                            Book shipment
                                        </CButton>
                                    )}
                                    {status !== 'in_route' && (
                                        <CButton
                                            color="primary"
                                            className="me-2 rounded"
                                            onClick={handleEditButton}
                                        >
                                            {!disabled ? 'Save' : 'Edit'}
                                        </CButton>
                                    )}
                                    <CButton
                                        color={!disabled ? 'warn' : 'danger'}
                                        className="me-2 rounded"
                                        onClick={handleDeleteButton}
                                    >
                                        Cancel
                                    </CButton>
                                </>
                            )}
                        </CButtonGroup>
                    </div>
                    <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                        <CCol>
                            <ShipperForm
                                isInfo={true}
                                formData={editedFormData}
                                handleInputChange={handleInputChange}
                                isDisabled={disabled}
                            />
                        </CCol>
                        <CCol>
                            <ConsineeForm
                                isInfo={true}
                                formData={editedFormData}
                                handleInputChange={handleInputChange}
                                isDisabled={disabled}
                            />
                        </CCol>
                    </CRow>
                    <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                        <CCol>
                            <ShipmentForm
                                isInfo={true}
                                formData={editedFormData}
                                handleInputChange={handleInputChange}
                                isDisabled={disabled}
                            />
                        </CCol>
                        <CCol>{renderForm()}</CCol>
                    </CRow>
                </>
            )}
        </div>
    )
}

export default FreightInfo
