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
} from '@coreui/react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPrint, faCopy } from '@fortawesome/free-solid-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY } from '../../../config'

import { useToast } from '../../../components/AppToastProvider'

// TODO: do rate stuff here
const Review = ({ data }) => {
    const navigate = useNavigate()
    const { form, setForm, loading, setLoading } = data
    const formRef = React.useRef(null)
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const [showFormDetails, setShowFormDetails] = useState(false)

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
                        value={'25 Feb 2025'}
                        disabled
                    />
                    <CButton
                        className="btn btn-outline-primary mt-2 me-2"
                        // onClick={() => handleSubmit('email')}
                    >
                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                        Email Quotes
                    </CButton>
                    <CButton
                        className="btn btn-outline-primary mt-2 me-2"
                        // onClick={() => handleSubmit('print')}
                    >
                        <FontAwesomeIcon icon={faPrint} className="me-2" />
                        Print Quotes
                    </CButton>
                    <CButton
                        className="btn btn-outline-primary mt-2 me-2"
                        // onClick={() => handleSubmit('copy')}
                    >
                        <FontAwesomeIcon icon={faCopy} className="me-2" />
                        Copy
                    </CButton>
                </CCol>
                <CCol md>
                    <div className="d-flex justify-content-end flex-column">
                        <span className="text-decoration-line-through">
                            $ {totalWeight(form.items) * totalDimensions(form.items) + 18}
                        </span>
                        <h4>$ {totalWeight(form.items) * totalDimensions(form.items)}</h4>
                        <CButton
                            className="btn btn-primary mt-2"
                            onClick={() => handleSubmit('book')}
                        >
                            Continue booking
                        </CButton>
                    </div>
                </CCol>
            </CRow>
        </div>
    )
}

export default Review

Review.propTypes = {
    data: PropTypes.object.isRequired,
}
