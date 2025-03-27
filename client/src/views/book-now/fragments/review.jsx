import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CForm,
    CRow,
    CCol,
    CFormSwitch,
    CFormCheck,
    CFormSelect,
    CTabs,
    CTabList,
    CTab,
    CTabContent,
    CTabPanel,
    CButton,
    CFormInput,
    CCard,
    CModal,
    CModalBody,
    CCardBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CSpinner,
} from '@coreui/react'
import PropTypes from 'prop-types'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPrint, faCopy } from '@fortawesome/free-solid-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY } from '../../../config'
import AppPagination from '../../../components/AppPagination'
import { useToast } from '../../../components/AppToastProvider'

// TODO: do rate stuff here
const Review = ({ data, shipmentRef }) => {
    const navigate = useNavigate()
    const { form, setForm } = data
    const formRef = React.useRef(null)
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const pdfRef = React.useRef()
    const [result, setResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    const generatePDF = () => {
        pdfRef.current.style.display = 'none'
        const bgColor = getComputedStyle(document.body).backgroundColor

        html2canvas(shipmentRef.current, {
            scale: 2,
            backgroundColor: bgColor,
        })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png')
                const pdf = new jsPDF('p', 'mm', 'a4')
                const imgWidth = 210
                const imgHeight = (canvas.height * imgWidth) / canvas.width

                pdf.setFillColor(bgColor)
                pdf.rect(
                    0,
                    0,
                    pdf.internal.pageSize.getWidth(),
                    pdf.internal.pageSize.getHeight(),
                    'F',
                )

                pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight)
                pdf.save(`Shipment-${form.tracking_number ? form.tracking_number : Date.now()}.pdf`)
            })
            .catch((error) => console.error('Error generating PDF:', error))
            .finally(() => {
                pdfRef.current.style.display = 'block'
            })
    }

    const handleSubmit = async (action) => {
        const recaptcha = await recaptchaRef.current.executeAsync()
        // should return the shipment id
        setLoading(true)
        axios
            .post(action === 'book' ? `/freight/book` : `/freight/update/${form.tracking_number}`, {
                ...form,
                recaptcha_ref: recaptcha,
            })
            .then((response) => {
                addToast(response.data.message, 'Shipment')
            })
            .catch((error) => {
                const message =
                    error.response?.data?.error || 'Server is offline or restarting please wait'
                addToast(message, 'Submit failed!')
            })
            .finally(() => setLoading(false))
    }

    const totalWeight = (items) => {
        return items.reduce((acc, item) => acc + parseFloat(item.weight), 0)
    }

    const totalDimensions = (items) => {
        return items.reduce((acc, item) => {
            const quantity = item.quantity || 1
            return acc + (item.length * item.width * item.height * quantity) / 1000
        }, 0)
    }

    const price = (form) => {
        let amount = totalWeight(form.items) * totalDimensions(form.items)
        if (!amount) return '$0'
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    const [showModal, setShowModal] = useState(false)

    const handleContinueBooking = () => {
        setShowModal(true)
    }

    const handleModalConfirm = () => {
        setShowModal(false)
        form.internal ? handleSubmit('update') : handleSubmit('book')
    }

    const fetchShippingAddress = async (page) => {
        if (!showModal) return
        setLoading(true)
        axios
            .post(`/addresses/`, { page })
            .then((response) => {
                setResult(response.data.data)
                setTotalPages(response.data.totalPages)
            })
            .catch((error) => {
                const message =
                    error.response?.data?.error || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    const handleShippingForm = async (address) => {
        if (form.selected_address !== address._id)
            setForm({ ...form, selected_address: address._id })
    }

    useEffect(() => {
        fetchShippingAddress(currentPage)
    }, [showModal, currentPage])

    return (
        <div ref={formRef}>
            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_APP_RECAPTCHA_SITE_KEY} />
            <h3 className="text-primary mt-4" id="review">
                Review
            </h3>
            <CRow>
                <CCol md className="mb-4">
                    <CFormInput
                        type="text"
                        floatingLabel="Shipment Date"
                        className="mb-2"
                        value={
                            form.expected_delivery_date
                                ? new Date(form.expected_delivery_date).toDateString()
                                : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString()
                        }
                        disabled
                    />
                    <CButton
                        ref={pdfRef}
                        className="btn btn-outline-primary mt-2 me-2 d-none"
                        onClick={generatePDF}
                    >
                        <FontAwesomeIcon icon={faPrint} className="me-2" />
                        Print Quotes
                    </CButton>
                </CCol>
                <CCol md>
                    <div className="d-flex justify-content-end flex-column">
                        <h2>{price(form)}</h2>
                        <CButton
                            className="btn btn-primary mt-2 w-75"
                            onClick={handleContinueBooking}
                        >
                            Continue booking
                        </CButton>
                    </div>
                </CCol>
            </CRow>
            {showModal && (
                <CModal
                    alignment="center"
                    fullscreen="sm"
                    scrollable
                    visible={showModal}
                    onClose={() => setShowModal(false)}
                    aria-labelledby="ScheduleShipment"
                >
                    <CModalHeader closeButton={false}>
                        <CModalTitle>Select Shipping Forms</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        {loading && (
                            <div className="loading-overlay">
                                <CSpinner color="primary" variant="grow" />
                            </div>
                        )}
                        {!loading &&
                            result &&
                            result.map((address, index) => (
                                <CCard
                                    key={index}
                                    className={`mb-3 ${form.selected_address === address._id ? 'active' : ''}`}
                                    onClick={() => handleShippingForm(address)}
                                    style={{
                                        cursor: 'pointer',
                                        border:
                                            form.selected_address === address._id
                                                ? '2px solid #0d6efd'
                                                : '1px solid #ced4da',
                                    }}
                                >
                                    <CCardBody>
                                        <div className="mb-2">
                                            <div className="mb-2 mb-sm-0">
                                                <div className="mb-2">
                                                    <h5 className="text-truncate">
                                                        {' '}
                                                        <span className="text-primary fw-medium text-uppercase me-1">
                                                            From
                                                        </span>{' '}
                                                        {address.from.name}
                                                    </h5>
                                                    <span className="text-muted text-truncate">
                                                        {address.from.phone_number} •{' '}
                                                        {address.from.address}
                                                        {', '}
                                                        {address.from.country}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="mb-2">
                                                    <h5 className="text-truncate">
                                                        <span className="text-primary fw-medium text-uppercase me-1">
                                                            To
                                                        </span>
                                                        {address.to.name}
                                                    </h5>
                                                    <span className="text-muted text-truncate">
                                                        {address.to.phone_number} •{' '}
                                                        {address.to.address} {', '}{' '}
                                                        {address.to.country}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CCardBody>
                                </CCard>
                            ))}
                        {totalPages > 1 && (
                            <AppPagination
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                                setTotalPages={setTotalPages}
                            />
                        )}
                    </CModalBody>
                    <CModalFooter>
                        <CButton className="btn" onClick={() => setShowModal(false)}>
                            Close
                        </CButton>
                        <CButton
                            className="btn btn-primary"
                            onClick={handleModalConfirm}
                            disabled={!form.selected_address}
                        >
                            Confirm
                        </CButton>
                    </CModalFooter>
                </CModal>
            )}
        </div>
    )
}

export default Review

Review.propTypes = {
    data: PropTypes.object.isRequired,
    shipmentRef: PropTypes.object.isRequired,
}
