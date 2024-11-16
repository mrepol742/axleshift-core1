import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    CCard,
    CCardGroup,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CPagination,
    CPaginationItem,
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
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_API_URL, VITE_APP_SESSION } from '../../config'
import ShipperForm from '../../components/forms/ShipperForm'
import ConsineeForm from '../../components/forms/ConsineeForm'
import ShipmentForm from '../../components/forms/ShipmentForm'
import AirForm from '../../components/forms/shipping/AirForm'
import LandForm from '../../components/forms/shipping/LandForm'
import SeaForm from '../../components/forms/shipping/SeaForm'
import { useToast } from '../../components/AppToastProvider'
import errorMessages from '../../components/ErrorMessages'
import Page404 from '../errors/404'

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

    const fetchData = async () => {
        setLoading(true)
        await axios
            .get(`${VITE_APP_API_URL}/api/v1/freight/${id}`, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => {
                setType(response.data.data.type)
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
        setEditedFormData((prev) => ({
            ...prev,
            recaptcha_ref: recaptcha,
        }))
        alert(editedFormData.recaptcha_ref)

        await axios
            .post(`${VITE_APP_API_URL}/api/v1/freight/u/${type}/${id}`, editedFormData, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => {
                addToast('Your changes has been saved.')
                navigate('/')
            })
            .catch((error) => {
                console.error(error)
                const message = errorMessages[error.status] || 'Internal Application Error'
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
        await axios
            .post(
                `${VITE_APP_API_URL}/api/v1/freight/d/${id}`,
                { recaptcha_ref: recaptcha },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                    },
                },
            )
            .then((response) => {
                addToast('Shipment has been deleted.')
                navigate('/')
            })
            .catch((error) => {
                console.error(error)
                const message = errorMessages[error.status] || 'Internal Application Error'
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

            {error && <Page404 />}

            {!error && (
                <>
                    {showQR && (
                        <CModal
                            visible={showQR}
                            onClose={() => setShowQR(false)}
                            alignment="center"
                            scrollable
                        >
                            <CModalHeader closeButton>Freight QRCode</CModalHeader>
                            <CModalBody>
                                <div className="d-flex justify-content-center align-items-center">
                                    <div ref={svgRef} className="d-inline-block">
                                        <QRCodeSVG value={id} />
                                    </div>
                                </div>
                            </CModalBody>
                            <CModalFooter>
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
                            <CButton
                                color="primary"
                                className="me-2 rounded"
                                onClick={handleEditButton}
                            >
                                {!disabled ? 'Save' : 'Edit'}
                            </CButton>
                            <CButton
                                color={!disabled ? 'secondary' : 'danger'}
                                className="me-2 rounded"
                                onClick={handleDeleteButton}
                            >
                                {!disabled ? 'Cancel' : 'Delete'}
                            </CButton>
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
