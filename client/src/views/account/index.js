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

const Account = () => {
    const recaptchaRef = React.useRef()
    const timezones = Intl.supportedValuesOf('timeZone')
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchUserData = async () => {
        await axios
            .post(
                `${VITE_APP_API_URL}/api/v1/auth/user`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                    },
                },
            )
            .then((response) => {
                setUser(response.data.user)
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    return (
        <div>
            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_APP_RECAPTCHA_SITE_KEY} />
            <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                <CCol>
                    <h4>Account details</h4>
                    <CCard className="mb-3">
                        <CCardBody>
                            <CForm>
                                <CRow>
                                    <CCol md={6} className="mb-3">
                                        <CInputGroup>
                                            <CInputGroupText>
                                                <FontAwesomeIcon icon={faUser} />
                                            </CInputGroupText>
                                            <CFormInput
                                                id="first_name"
                                                placeholder="First Name"
                                                autoComplete="given-name"
                                                value={user.first_name}
                                                required
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
                                                placeholder="Last Name"
                                                autoComplete="family-name"
                                                value={user.last_name}
                                                required
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
                                        name="timezone"
                                        placeholder="Timezone"
                                        list="timezone-options"
                                        required
                                    />
                                    <datalist id="timezone-options">
                                        {timezones.map((tz) => (
                                            <option key={tz} value={tz} />
                                        ))}
                                    </datalist>
                                </CInputGroup>
                                <CButton
                                    color="secondary"
                                    className="mb-4 me-2 rounded"
                                    size="sm"
                                    disabled
                                >
                                    <FontAwesomeIcon icon={faGoogle} /> Connect Google
                                </CButton>
                                <CButton
                                    color="secondary"
                                    className="mb-4 me-2 rounded"
                                    size="sm"
                                    disabled
                                >
                                    <FontAwesomeIcon icon={faGithub} /> Connect Github
                                </CButton>
                                <CButton
                                    type="submit"
                                    color="primary"
                                    className="d-block me-2 rounded"
                                    disabled
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
                            <CForm>
                                <h6>Email</h6>
                                <CInputGroup className="mb-3">
                                    <CInputGroupText>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </CInputGroupText>
                                    <CFormInput
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        autoComplete="email"
                                        value={user.email}
                                        required
                                    />
                                </CInputGroup>
                                <CButton
                                    type="submit"
                                    color="primary"
                                    className="me-2 rounded"
                                    disabled
                                >
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
