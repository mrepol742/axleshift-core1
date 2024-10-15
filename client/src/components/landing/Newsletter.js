import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
    CContainer,
    CRow,
    CCol,
    CImage,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
} from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import errorMessages from '../../components/http/ErrorMessages'

const Newsletter = ({ setLoading }) => {
    const VITE_APP_RECAPTCHA_SITE_KEY = import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY
    const [emailAddress, setEmailAddress] = useState('')
    const recaptchaRef = React.useRef()
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()

        const formData = new FormData()
        formData.append('email', emailAddress)
        formData.append('recaptcha_ref', recaptcha)

        await axios
            .post(`${import.meta.env.VITE_APP_API_URL}/api/v1/newsletter`, formData, {
                headers: {},
            })
            .then((response) => {
                if (response.data.message) setMessage(response.data.message)
            })
            .catch((error) => {
                console.error(error)
                const message = errorMessages[error.status] || 'An unexpected error occurred'
                setMessage(message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <CContainer fluid className="h-100" data-aos="fade-up">
            <div className="bg-primary m-2 m-md-5">
                <CRow className="h-100 justify-content-start align-items-center p-5">
                    <CCol xs={12} md={7} lg={6} xl={5} className="mb-4 p-2" data-aos="zoom-in-down">
                        <h1 className="text-white">Newsletter - Stay tune</h1>
                        <p className="lead text-white">
                            We will email you about our products newest updates.
                        </p>
                        <CForm onSubmit={handleSubmit}>
                            <ReCAPTCHA
                                style={{ display: 'none' }}
                                ref={recaptchaRef}
                                size="invisible"
                                sitekey={VITE_APP_RECAPTCHA_SITE_KEY}
                            />
                            <CInputGroup className="mb-1">
                                <CFormInput
                                    aria-describedby="basic-addon"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="name@example.com"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                />
                                <CInputGroupText id="basic-addon" type="submit">
                                    <FontAwesomeIcon icon={faPaperPlane} className="text-white" />
                                </CInputGroupText>
                            </CInputGroup>
                            <span>{message}</span>
                        </CForm>
                    </CCol>
                    <CCol xs={12} md={5} className="mb-4 p-2 text-center" data-aos="zoom-in-left">
                        <FontAwesomeIcon icon={faEnvelope} className="fa-8x text-white" />
                    </CCol>
                </CRow>
            </div>
        </CContainer>
    )
}

Newsletter.propTypes = {
    setLoading: PropTypes.func.isRequired,
}

export default Newsletter
