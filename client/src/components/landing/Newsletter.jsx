import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
    CContainer,
    CRow,
    CCol,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
} from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { VITE_APP_RECAPTCHA_SITE_KEY } from '../../config'

const Newsletter = ({ setLoading }) => {
    const [emailAddress, setEmailAddress] = useState('')
    const recaptchaRef = React.useRef()
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const recaptcha = await recaptchaRef.current.executeAsync()
        setLoading(true)
        axios
            .post(`/newsletter`, {
                email: emailAddress,
                recaptcha_ref: recaptcha,
            })
            .then((response) => setMessage(response.data.message))
            .catch((error) => {
                console.error(error)
                const message =
                    error.response?.data?.error ||
                    (error.message === 'network error'
                        ? 'Server is offline or restarting please wait'
                        : error.message)
                setMessage(message)
            })
            .finally(() => setLoading(false))
    }

    return (
        <CContainer
            fluid
            className="h-100 d-flex justify-content-center align-items-center"
            data-aos="fade-up"
        >
            <div className="bg-primary rounded m-2 m-md-5 shadow p-5 text-center">
                <h1 className="text-white">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2 text-white" /> Newsletter -
                    Stay tune
                </h1>
                <p className="lead text-white">
                    We will email you about our products newest updates.
                </p>
                <CForm>
                    <ReCAPTCHA
                        style={{ display: 'none' }}
                        ref={recaptchaRef}
                        size="invisible"
                        sitekey={VITE_APP_RECAPTCHA_SITE_KEY}
                    />
                    <CInputGroup className="mb-3">
                        <CFormInput
                            aria-describedby="basic-addon"
                            type="email"
                            name="email"
                            autoComplete="email"
                            placeholder="name@example.com"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                        />
                        <CInputGroupText
                            id="basic-addon"
                            onClick={(e) => handleSubmit(e)}
                            className="bg-primary"
                        >
                            <FontAwesomeIcon icon={faPaperPlane} className="text-white" />
                        </CInputGroupText>
                    </CInputGroup>
                    <span>{message}</span>
                </CForm>
            </div>
        </CContainer>
    )
}

Newsletter.propTypes = {
    setLoading: PropTypes.func.isRequired,
}

export default Newsletter
