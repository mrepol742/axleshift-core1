import React, { useEffect, useState } from 'react'
import {
    CImage,
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
import { faLock, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_API_URL, VITE_APP_SESSION } from '../../config'
import Profile from '../../components/Profile'
import errorMessages from '../../components/ErrorMessages'
import { useToast } from '../../components/AppToastProvider'

const Security = () => {
    const user = Profile()
    const recaptchaRef = React.useRef()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
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
                    <h4>{user.password ? 'Change' : 'Set'} Password</h4>
                    <CCard className="mb-3">
                        <CCardBody>
                            <CForm>
                                <CInputGroup className="mb-3">
                                    <CInputGroupText>
                                        <FontAwesomeIcon icon={faLock} />
                                    </CInputGroupText>
                                    <CFormInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        autoComplete="current-password"
                                        required
                                    />
                                    <CInputGroupText>
                                        <span
                                            onClick={togglePasswordVisibility}
                                            aria-label={
                                                showPassword ? 'Hide password' : 'Show password'
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={showPassword ? faEyeSlash : faEye}
                                                onClick={togglePasswordVisibility}
                                            />
                                        </span>
                                    </CInputGroupText>
                                </CInputGroup>
                                <CInputGroup className="mb-3">
                                    <CInputGroupText>
                                        <FontAwesomeIcon icon={faLock} />
                                    </CInputGroupText>
                                    <CFormInput
                                        id="repeat_password"
                                        type="password"
                                        placeholder="Repeat password"
                                        autoComplete="new-password"
                                        required
                                    />
                                </CInputGroup>
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
        </div>
    )
}

export default Security
