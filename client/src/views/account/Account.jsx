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
import { faEnvelope, faUser, faClock, faCamera, faC } from '@fortawesome/free-solid-svg-icons'
import { faGoogle, faGithub, faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_API_URL, VITE_APP_AWS_S3 } from '../../config'
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
    const [profilePic, setProfilePic] = useState(null)

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
                    error.response?.data?.error ||
                    (error.message === 'network error'
                        ? 'Server is offline or restarting please wait'
                        : error.message)
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    const uploadProfile = async (e) => {
        e.preventDefault()
        const recaptcha = await recaptchaRef.current.executeAsync()
        setLoading(true)

        const formData = new FormData()
        formData.append('profile_pic', profilePic)
        formData.append('recaptcha_ref', recaptcha)

        axios
            .post(`/auth/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                if (response.data.error) return addToast(response.data.error)
                addToast('Your profile picture has been updated.')
            })
            .catch((error) => {
                const message =
                    error.response?.data?.error ||
                    (error.message === 'network error'
                        ? 'Server is offline or restarting please wait'
                        : error.message)
                addToast(message)
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

            <h4>Account details</h4>
            <CCard className="mb-3">
                <CCardBody>
                    <CForm onSubmit={(e) => handleSubmit(e)}>
                        {profilePic ? (
                            <CImage
                                src={URL.createObjectURL(profilePic)}
                                className="rounded-pill p-1 border mb-3"
                                width="100px"
                                fluid
                                loading="lazy"
                            />
                        ) : user.avatar ? (
                            <>
                                <CImage
                                    crossOrigin="Anonymous"
                                    src={`${VITE_APP_AWS_S3}/images/${user.avatar}.png`}
                                    className="rounded-pill p-1 border mb-3"
                                    width="100px"
                                    fluid
                                    loading="lazy"
                                />
                            </>
                        ) : (
                            <div
                                className="rounded-pill bg-primary d-flex align-items-center justify-content-center mb-3 fs-4"
                                style={{ width: '70px', height: '70px', color: 'white' }}
                            >
                                {getInitials(user.first_name)}
                            </div>
                        )}
                        <FontAwesomeIcon
                            id="faCamera"
                            icon={faCamera}
                            className="position-absolute bg-secondary p-2 rounded-pill bg-opacity-50"
                            style={{ top: '50px', left: '50px', cursor: 'pointer' }}
                            onClick={() => {
                                const fileInput = document.querySelector(
                                    'input[name="profile_pic"]',
                                )
                                fileInput.click()
                            }}
                        />
                        <CInputGroup className="mb-2">
                            <CFormInput
                                className="d-none"
                                name="profile_pic"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    setProfilePic(e.target.files[0])
                                    const uploadButton = document.getElementById('upload-button')
                                    const faCamera = document.getElementById('faCamera')
                                    if (e.target.files.length > 0) {
                                        uploadButton.style.display = 'inline-block'
                                        faCamera.style.display = 'none'
                                    } else {
                                        uploadButton.style.display = 'none'
                                        faCamera.style.display = 'inline-block'
                                    }
                                }}
                            />
                            <CButton
                                id="upload-button"
                                color="primary"
                                className="ms-2 rounded d-none"
                                onClick={(e) => {
                                    if (profilePic) {
                                        uploadProfile(e)
                                    }
                                }}
                            >
                                Upload
                            </CButton>
                        </CInputGroup>
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
                        <CInputGroup className="mb-2 d-none">
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
                        <div className="mb-3">
                            <CButton
                                color="primary"
                                className="mb-1 me-2 rounded"
                                size="sm"
                                disabled={user.oauth2 && user.oauth2.google}
                            >
                                <FontAwesomeIcon icon={faGoogle} className="me-1" />{' '}
                                {user.oauth2 && user.oauth2.google
                                    ? user.oauth2.google.email
                                    : 'Connect Google'}
                            </CButton>
                            <CButton
                                color="primary"
                                className="mb-1 me-2 rounded"
                                size="sm"
                                disabled={user.oauth2 && user.oauth2.github}
                            >
                                <FontAwesomeIcon icon={faGithub} className="me-1" />{' '}
                                {user.oauth2 && user.oauth2.github
                                    ? user.oauth2.github.email
                                    : 'Connect Github'}
                            </CButton>
                            <CButton
                                color="primary"
                                className="mb-1 me-2 rounded"
                                size="sm"
                                disabled={user.oauth2 && user.oauth2.microsoft}
                            >
                                <FontAwesomeIcon icon={faMicrosoft} className="me-1" />{' '}
                                {user.oauth2 && user.oauth2.microsoft
                                    ? user.oauth2.microsoft.email
                                    : 'Connect Microsoft'}
                            </CButton>
                        </div>
                        <CButton type="submit" color="primary" className="d-block me-2 rounded">
                            Save changes
                        </CButton>
                    </CForm>
                </CCardBody>
            </CCard>
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
            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_APP_RECAPTCHA_SITE_KEY} />
        </div>
    )
}

export default Account
