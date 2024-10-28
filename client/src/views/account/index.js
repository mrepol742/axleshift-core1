import React, { useEffect, useState } from 'react'
import {
    CSpinner,
    CCard,
    CCardHeader,
    CCardBody,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CForm,
    CButton,
    CCol,
    CRow,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faUser, faClock } from '@fortawesome/free-solid-svg-icons'
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_API_URL, VITE_APP_SESSION } from '../../config'
import Profile from '../../components/Profile'
import errorMessages from '../../components/http/ErrorMessages'

const Account = () => {
    const user = Profile()
    const recaptchaRef = React.useRef()
    const timezones = Intl.supportedValuesOf('timeZone')
    const [accountDetails, setAccountDetails] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        timezone: user.timezone,
    })
    const [contactInfo, setContactInfo] = useState({
        email: user.email,
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleInputChange = (e, type) => {
        const { id, value } = e.target
        if (type === 'accountDetails')
            return setAccountDetails((prev) => ({
                ...prev,
                [id]: value,
            }))
        setContactInfo((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    const handleAccountDetails = (e) => {
        e.preventDefault()
        handleSubmit(accountDetails)
    }

    const handleContactInfo = (e) => {
        e.preventDefault()
        handleSubmit(contactInfo)
    }

    const handleSubmit = async (formData) => {
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()
        const formDataToSend = new FormData()
        for (const key in formData) {
            formDataToSend.append(key, formData[key])
        }
        formDataToSend.append('recaptcha_ref', recaptcha)

        await axios
            .post(`${VITE_APP_API_URL}/api/v1/auth/user`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => {
                if (response.data.error) return alert(response.data.error)
                alert('Done')
            })
            .catch((error) => {
                console.error(error)
                const message = errorMessages[error.status] || 'An unexpected error occurred'

                alert(message)
            })
            .finally(() => setLoading(false))
    }

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}
            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_APP_RECAPTCHA_SITE_KEY} />
            <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                <CCol>
                    <h4>Account details</h4>
                    <CCard className="mb-3">
                        <CCardBody>
                            <CForm onSubmit={handleAccountDetails}>
                                <CRow>
                                    <CCol md={6} className="mb-3">
                                        <CInputGroup>
                                            <CInputGroupText>
                                                <FontAwesomeIcon icon={faUser} />
                                            </CInputGroupText>
                                            <CFormInput
                                                id="first_name"
                                                type="text"
                                                placeholder="First Name"
                                                autoComplete="given-name"
                                                value={accountDetails.first_name}
                                                onChange={(e) =>
                                                    handleInputChange(e, 'accountDetails')
                                                }
                                            />
                                        </CInputGroup>
                                    </CCol>
                                    <CCol md={6} className="mb-3">
                                        <CInputGroup>
                                            <CInputGroupText>
                                                <FontAwesomeIcon icon={faUser} />
                                            </CInputGroupText>
                                            <CFormInput
                                                id="last_name"
                                                type="text"
                                                placeholder="Last Name"
                                                autoComplete="family-name"
                                                value={accountDetails.last_name}
                                                onChange={(e) =>
                                                    handleInputChange(e, 'accountDetails')
                                                }
                                            />
                                        </CInputGroup>
                                    </CCol>
                                </CRow>
                                <CInputGroup className="mb-3">
                                    <CInputGroupText>
                                        <FontAwesomeIcon icon={faClock} />
                                    </CInputGroupText>
                                    <CFormInput
                                        type="text"
                                        id="timezone"
                                        placeholder="Timezone"
                                        list="timezone-options"
                                        value={accountDetails.timezone}
                                        onChange={(e) => handleInputChange(e, 'accountDetails')}
                                    />
                                    <datalist id="timezone-options">
                                        {timezones.map((tz) => (
                                            <option key={tz} value={tz} />
                                        ))}
                                    </datalist>
                                </CInputGroup>
                                <div className="mb-3">
                                    <CButton
                                        color="secondary"
                                        className="mb-1 me-2 rounded"
                                        size="sm"
                                        disabled
                                    >
                                        <FontAwesomeIcon icon={faGoogle} />{' '}
                                        {user.oauth2.google
                                            ? user.oauth2.google.email
                                            : 'Connect Google'}
                                    </CButton>
                                    <CButton
                                        color="secondary"
                                        className="mb-1 me-2 rounded"
                                        size="sm"
                                        disabled
                                    >
                                        <FontAwesomeIcon icon={faGithub} />{' '}
                                        {user.oauth2.github
                                            ? user.oauth2.github.email
                                            : 'Connect Github'}
                                    </CButton>
                                </div>
                                <CButton
                                    type="submit"
                                    color="primary"
                                    className="d-block me-2 rounded"
                                >
                                    Save changes
                                </CButton>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <h4>Contact info</h4>
                    <CCard className="mb-3">
                        <CCardBody>
                            <CForm onSubmit={handleContactInfo}>
                                <h6>Email</h6>
                                <CInputGroup className="mb-3">
                                    <CInputGroupText>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </CInputGroupText>
                                    <CFormInput
                                        type="email"
                                        id="email"
                                        placeholder="Email"
                                        autoComplete="email"
                                        value={contactInfo.email}
                                        onChange={(e) => handleInputChange(e, 'contactInfo')}
                                    />
                                </CInputGroup>
                                <CButton type="submit" color="primary" className="me-2 rounded">
                                    Save changes
                                </CButton>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <h4>Delete account</h4>
            <CCard className="mb-3">
                <CCardBody>
                    <p>
                        If you wish to delete your account, please note that this action is
                        irreversible and will remove all your data permanently.
                        <br />
                        To proceed with the deletion of your account, please click the button below:
                    </p>
                    <span className="text-muted">
                        We cannot process your account deletion request, if you have unpaid invoices
                        or inroute shippment
                    </span>
                    <CButton
                        type="submit"
                        color="danger"
                        className="mt-4 d-block me-2 rounded"
                        disabled
                    >
                        Request account deletion
                    </CButton>
                </CCardBody>
            </CCard>
        </div>
    )
}

export default Account
