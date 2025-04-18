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

const DeleteDownload = () => {
    const { user } = useUserProvider()
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(false)

    return (
        <div>
            <h4>Download Your Info</h4>
            <CCard className="mb-3">
                <CCardBody>
                    <p>
                        If you wish to download your account information, please note that this
                        action will create a zip file containing all your data.
                    </p>
                    <CButton
                        type="submit"
                        color="success"
                        className="mt-4 d-block me-2 rounded text-start"
                        disabled
                    >
                        Download
                    </CButton>
                </CCardBody>
            </CCard>
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
            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_APP_RECAPTCHA_SITE_KEY} />
        </div>
    )
}

export default DeleteDownload
