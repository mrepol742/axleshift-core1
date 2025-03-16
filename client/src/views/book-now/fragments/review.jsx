import React, { useState } from 'react'
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
    CModalFooter,
    CModalHeader,
    CModalTitle,
} from '@coreui/react'
import PropTypes from 'prop-types'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPrint, faCopy } from '@fortawesome/free-solid-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY } from '../../../config'

import { useToast } from '../../../components/AppToastProvider'

// TODO: do rate stuff here
const Review = ({ data, shipmentRef }) => {
    const navigate = useNavigate()
    const { form, setForm, loading, setLoading } = data
    const formRef = React.useRef(null)
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const [showFormDetails, setShowFormDetails] = useState(false)
    const pdfRef = React.useRef()

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
                navigate(`/shipment/${response.data.tracking_number}/forms`)
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
        form.internal ? handleSubmit('update') : setShowModal(true)
    }

    const handleModalConfirm = () => {
        setShowModal(false)
        handleSubmit('book')
    }

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
                        <h4>{price(form)}</h4>
                        <CButton className="btn btn-primary mt-2" onClick={handleContinueBooking}>
                            Continue booking
                        </CButton>
                    </div>
                </CCol>
            </CRow>
            {showModal && (
                <CModal
                    alignment="center"
                    scrollable
                    visible={showModal}
                    onClose={() => setShowModal(false)}
                    aria-labelledby="ScheduleShipment"
                >
                    <CModalHeader>
                        <CModalTitle>Schedule Shipment</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <p>
                            Continuing will generate a tracking number and you will not be allowed
                            to change the shipment type.
                        </p>
                    </CModalBody>
                    <CModalFooter>
                        <CButton className="btn" onClick={() => setShowModal(false)}>
                            Close
                        </CButton>
                        <CButton className="btn btn-primary" onClick={handleModalConfirm}>
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
