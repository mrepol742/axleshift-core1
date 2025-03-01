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
import { useToast } from '../../components/AppToastProvider'
import errorMessages from '../../utils/ErrorMessages'
import { useUserProvider } from '../../components/UserProvider'
import ShipmentInfo from '../book-now/fragments/info'
import ShipmentReview from '../book-now/fragments/review'
import Shipment from '../book-now/fragments/shipment'

const FreightInfo = () => {
    const _FREIGHT_ = {
        isImport: false,
        isResidentialAddress: false,
        containsDangerGoods: false,
        containsDocuments: false,
        from: [
            {
                name: '',
                company: '',
                country: '',
                countryCode: '',
                city: '',
                zipCode: '',
                address: '',
                address2: '',
                address3: '',
                phone: '',
                email: '',
                taxId: '',
            },
        ],
        to: [
            {
                name: '',
                company: '',
                country: '',
                countryCode: '',
                city: '',
                zipCode: '',
                address: '',
                address2: '',
                address3: '',
                phone: '',
                email: '',
                employerId: '',
            },
        ],
        type: 'private',
        items: [],
    }
    const { user } = useUserProvider()
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const [form, setForm] = useState(_FREIGHT_)
    const [editedform, setEditedform] = useState(_FREIGHT_)
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
        setEditedform((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [id]: value,
            },
        }))
    }

    const bookShipment = async () => {
        const recaptcha = await recaptchaRef.current.executeAsync()
        setLoading(true)
        /*
         * Even tho the system no longer uses mongodb generated object id as tracking number
         * the backend still uses it to find the shipment
         * and assign neccessary data
         */
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
                setForm({ ...response.data, internal: true })
                setEditedform({ ...response.data, internal: true })
            })
            .catch((error) => {
                console.error(error)
                setError(true)
            })
            .finally(() => setLoading(false))
    }

    const handleEditButton = async () => {
        if (disabled) return setDisabled(false)
        const recaptcha = await recaptchaRef.current.executeAsync()
        setLoading(true)
        const updatedform = {
            ...editedform,
            recaptcha_ref: recaptcha,
        }

        axios
            .post(`/freight/update/${id}`, updatedform)
            .then((response) => addToast('Your changes has been saved.'))
            .catch((error) => {
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message, 'Submit failed!')
                setEditedform(form)
            })
            .finally(() => {
                setLoading(false)
                setDisabled(true)
            })
    }

    const handleDeleteButton = async () => {
        if (!disabled) {
            setDisabled(true)
            setEditedform(form)
            return
        }
        const recaptcha = await recaptchaRef.current.executeAsync()
        setLoading(true)
        axios
            .post(`/freight/cancel/${id}`, { recaptcha_ref: recaptcha })
            .then((response) => {
                addToast('Shipment has been cancelled.')
                navigate('/dashboard')
            })
            .catch((error) => {
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message, 'Submit failed!')
                setEditedform(form)
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

    useEffect(() => {
        fetchData()
    }, [])

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    if (error)
        return (
            <CRow className="justify-content-center my-5">
                <CCol md={6}>
                    <div className="clearfix">
                        <h1 className="float-start display-3 me-4">OOPS</h1>
                        <h4>There was no shipment found.</h4>
                        <p>Double check tracking id for any mistake.</p>
                    </div>
                </CCol>
            </CRow>
        )

    // i tried to resuse them like how she re--use u
    return (
        <div>
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
            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_APP_RECAPTCHA_SITE_KEY} />
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4">
                <span className="d-block">{id}</span>
                <CButtonGroup className="mb-2 mb-sm-0">
                    <CButton
                        color="primary"
                        className="me-2 rounded"
                        onClick={(e) => setShowQR(true)}
                    >
                        <FontAwesomeIcon icon={faQrcode} />
                    </CButton>
                    {status !== 'cancelled' && status !== 'received' && (
                        <>
                            {status === 'to_pay' && user.role === 'user' && (
                                <CButton
                                    color="primary"
                                    className="me-2 rounded"
                                    onClick={bookShipment}
                                >
                                    Book shipment
                                </CButton>
                            )}
                            <CButton
                                color="primary"
                                className="me-2 rounded"
                                onClick={handleEditButton}
                                disabled={['to_receive', 'received'].includes(status)}
                            >
                                {!disabled ? 'Save' : 'Edit'}
                            </CButton>
                            <CButton
                                color={!disabled ? 'warn' : 'danger'}
                                className="me-2 rounded"
                                onClick={handleDeleteButton}
                                disabled={['to_receive', 'received'].includes(status)}
                            >
                                Cancel
                            </CButton>
                        </>
                    )}
                </CButtonGroup>
            </div>

            <ShipmentInfo data={{ form, setForm, loading, setLoading }} />
        </div>
    )
}

export default FreightInfo
