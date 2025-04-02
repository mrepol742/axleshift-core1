import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CButton, CSpinner } from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { VITE_APP_RECAPTCHA_SITE_KEY } from '../../../config'
import { useToast } from '../../../components/AppToastProvider'

const Maintenance = () => {
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [maintenance, setMaintenance] = useState(false)

    const fetchData = async () => {
        axios
            .get(`/sec/management/maintenance`)
            .then((response) => setMaintenance(response.data.maintenance || 'a'))
            .catch((error) => {
                const message =
                    error.response?.data?.error ||
                    error.message ||
                    'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
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

            <h4>Enable maintenance</h4>
            <CCard>
                <CCardBody>
                    <p>
                        When enabled, it prevents users from interacting with the platform until
                        maintenance is complete.
                    </p>
                    <CButton
                        type="submit"
                        color="danger"
                        className="mt-4 d-block me-2 rounded"
                        disabled={maintenance}
                    >
                        <FontAwesomeIcon icon={faCircleExclamation} className="me-2" /> Enable
                        maintenance
                    </CButton>
                </CCardBody>
            </CCard>
        </div>
    )
}

export default Maintenance
