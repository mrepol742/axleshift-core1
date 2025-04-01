import React, { useState, useEffect } from 'react'
import {
    CImage,
    CSpinner,
    CCard,
    CCardBody,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CForm,
    CButton,
    CCol,
    CRow,
    CFormCheck,
    CButtonGroup,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faUser, faClock } from '@fortawesome/free-solid-svg-icons'
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_API_URL } from '../../config'
import { useUserProvider } from '../../components/UserProvider'
import { useToast } from '../../components/AppToastProvider'

const Account = () => {
    const { user, setUser } = useUserProvider()
    const recaptchaRef = React.useRef()
    const timezones = Intl.supportedValuesOf('timeZone')
    const { addToast } = useToast()
    const [accountDetails, setAccountDetails] = useState({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        timezone: user.timezone,
    })
    const [loading, setLoading] = useState(false)

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : ''
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        return setAccountDetails((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (
            accountDetails.username === user.username &&
            accountDetails.email === user.email &&
            accountDetails.first_name === user.first_name &&
            accountDetails.last_name === user.last_name &&
            accountDetails.timezone === user.timezone
        )
            return addToast('No changes detected.')

        const recaptcha = await recaptchaRef.current.executeAsync()
        setLoading(true)

        axios
            .post(`/auth/user`, {
                ...accountDetails,
                recaptcha_ref: recaptcha,
            })
            .then((response) => {
                if (response.data.error) return addToast(response.data.error)
                setUser(response.data)
                addToast('Your changes has been saved.')
            })
            .catch((error) => {
                const message =
                    error.response?.data?.error || 'Server is offline or restarting please wait'
                addToast(message, 'Fetch failed!')
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
                            <CForm onSubmit={(e) => handleSubmit(e)}>
                                {user.avatar ? (
                                    <CImage
                                        crossOrigin="Anonymous"
                                        src={`${VITE_APP_API_URL}/u/${user.avatar}.png`}
                                        className="rounded-5"
                                        fluid
                                        width="40px"
                                        height="40px"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div
                                        className="rounded-pill bg-primary d-flex align-items-center justify-content-center mb-3 fs-4"
                                        style={{ width: '70px', height: '70px', color: 'white' }}
                                    >
                                        {getInitials(user.first_name)}
                                    </div>
                                )}
                                <CFormInput
                                    name="profile_pic"
                                    type="file"
                                    className="mb-3"
                                    disabled
                                />
                                <CInputGroup className="mb-3">
                                    <CInputGroupText>
                                        <FontAwesomeIcon icon={faUser} />
                                    </CInputGroupText>
                                    <CFormInput
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        autoComplete="username"
                                        value={accountDetails.username}
                                        onChange={(e) => handleInputChange(e)}
                                    />
                                </CInputGroup>
                                <CInputGroup className="mb-3">
                                    <CInputGroupText>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </CInputGroupText>
                                    <CFormInput
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        autoComplete="email"
                                        value={accountDetails.email}
                                        onChange={(e) => handleInputChange(e)}
                                    />
                                </CInputGroup>
                                <CRow>
                                    <CCol md={6} className="mb-3">
                                        <CInputGroup>
                                            <CInputGroupText>
                                                <FontAwesomeIcon icon={faUser} />
                                            </CInputGroupText>
                                            <CFormInput
                                                name="first_name"
                                                type="text"
                                                placeholder="First Name"
                                                autoComplete="given-name"
                                                value={accountDetails.first_name}
                                                onChange={(e) => handleInputChange(e)}
                                            />
                                        </CInputGroup>
                                    </CCol>
                                    <CCol md={6} className="mb-3">
                                        <CInputGroup>
                                            <CInputGroupText>
                                                <FontAwesomeIcon icon={faUser} />
                                            </CInputGroupText>
                                            <CFormInput
                                                name="last_name"
                                                type="text"
                                                placeholder="Last Name"
                                                autoComplete="family-name"
                                                value={accountDetails.last_name}
                                                onChange={(e) => handleInputChange(e)}
                                            />
                                        </CInputGroup>
                                    </CCol>
                                </CRow>
                                <CInputGroup className="mb-2">
                                    <CInputGroupText>
                                        <FontAwesomeIcon icon={faClock} />
                                    </CInputGroupText>
                                    <CFormInput
                                        type="text"
                                        name="timezone"
                                        placeholder="Timezone"
                                        list="timezone-options"
                                        value={accountDetails.timezone}
                                        onChange={(e) => handleInputChange(e)}
                                    />
                                    <datalist id="timezone-options">
                                        {timezones.map((tz) => (
                                            <option key={tz} value={tz} />
                                        ))}
                                    </datalist>
                                </CInputGroup>
                                {user.role === 'user' && (
                                    <div className="mb-3">
                                        <CButton
                                            color="secondary"
                                            className="mb-1 me-2 rounded"
                                            size="sm"
                                            disabled
                                        >
                                            <FontAwesomeIcon icon={faGoogle} />{' '}
                                            {user.oauth2 && user.oauth2.google
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
                                            {user.oauth2 && user.oauth2.github
                                                ? user.oauth2.github.email
                                                : 'Connect Github'}
                                        </CButton>
                                    </div>
                                )}
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
                <CCol></CCol>
            </CRow>
            {user.role === 'user' && (
                <>
                    <h4 className="text-danger">Delete account</h4>
                    <CCard className="mb-3">
                        <CCardBody>
                            <p>
                                If you wish to delete your account, please note that this action is
                                irreversible and will remove all your data permanently.
                                <br />
                                To proceed with the deletion of your account, please click the
                                button below:
                            </p>
                            <span className="text-muted">
                                We cannot process your account deletion request, if you have unpaid
                                invoices or inroute shippment
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
                </>
            )}
        </div>
    )
}

export default Account
