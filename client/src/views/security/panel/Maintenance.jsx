import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CButton, CSpinner } from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY } from '../../../config'
import { useToast } from '../../../components/AppToastProvider'
import errorMessages from '../../../components/ErrorMessages'

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
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}

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
                        Enable maintenance
                    </CButton>
                </CCardBody>
            </CCard>
        </div>
    )
}

export default Maintenance
