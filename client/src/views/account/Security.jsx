import React, { useState } from 'react'
import {
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
    CAlert,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faEyeSlash, faEye, faXmark } from '@fortawesome/free-solid-svg-icons'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY } from '../../config'
import { useUserProvider } from '../../components/UserProvider'

const Security = () => {
    const { user } = useUserProvider()
    const recaptchaRef = React.useRef()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        password: '',
        new_password: '',
        repeat_password: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword1, setShowPassword1] = useState(false)
    const [error, setError] = useState({
        error: false,
        message: '',
    })

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    const handleSubmit = async (e) => {
        if (e) e.preventDefault()
        const recaptcha = await recaptchaRef.current.executeAsync()
        setLoading(true)
        axios
            .post(`/auth/password`, {
                ...formData,
                recaptcha_ref: recaptcha,
            })
            .then((response) => {
                if (response.data.error)
                    return setError({
                        error: true,
                        message: response.data.error,
                    })
            })
            .catch((error) => {
                const message =
                    error.response?.data?.error || 'Server is offline or restarting please wait'

                setError({
                    error: true,
                    message,
                })
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
                    <h4>{user.password === 'OK' ? 'Change' : 'Set'} Password</h4>
                    <CCard className="mb-3">
                        <CCardBody>
                            {error.error && (
                                <CAlert color="danger" className="d-flex align-items-center">
                                    <FontAwesomeIcon
                                        className="flex-shrink-0 me-2"
                                        icon={faXmark}
                                        size="xl"
                                    />
                                    <div>{error.message}</div>
                                </CAlert>
                            )}
                            <CForm onSubmit={handleSubmit}>
                                {user.password === 'OK' && (
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <FontAwesomeIcon icon={faLock} />
                                        </CInputGroupText>
                                        <CFormInput
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                            autoComplete="current-password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange(e)}
                                            required
                                        />
                                        <CInputGroupText>
                                            <span
                                                onClick={(e) => setShowPassword(!showPassword)}
                                                aria-label={
                                                    showPassword ? 'Hide password' : 'Show password'
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={showPassword ? faEyeSlash : faEye}
                                                    onClick={(e) => setShowPassword(!showPassword)}
                                                />
                                            </span>
                                        </CInputGroupText>
                                    </CInputGroup>
                                )}
                                <CInputGroup className="mb-3">
                                    <CInputGroupText>
                                        <FontAwesomeIcon icon={faLock} />
                                    </CInputGroupText>
                                    <CFormInput
                                        id="new_password"
                                        type={showPassword1 ? 'text' : 'password'}
                                        placeholder="New Password"
                                        autoComplete="new-password"
                                        onChange={(e) => handleInputChange(e)}
                                        required
                                    />
                                    <CInputGroupText>
                                        <span
                                            onClick={(e) => setShowPassword1(!showPassword1)}
                                            aria-label={
                                                showPassword1 ? 'Hide password' : 'Show password'
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={showPassword1 ? faEyeSlash : faEye}
                                                onClick={(e) => setShowPassword1(!showPassword1)}
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
                                        value={formData.repeat_password}
                                        onChange={(e) => handleInputChange(e)}
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
            a
        </div>
    )
}

export default Security
