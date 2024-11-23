import React, { useEffect, useState } from 'react'
import {
    CContainer,
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CForm,
    CFormSelect,
    CRow,
    CCol,
    CImage,
    CCard,
    CCardTitle,
    CButton,
    CCardHeader,
    CSpinner,
    CCardBody,
    CCardText,
    CCardFooter,
    CTable,
    CTableHead,
    CTableRow,
    CTableDataCell,
    CTableBody,
    CTableHeaderCell,
    CTabs,
    CTabList,
    CTab,
    CTabContent,
    CTabPanel,
} from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { parseTimestamp } from '../../../components/Timestamp'
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_API_URL, VITE_APP_SESSION } from '../../../config'
import { useToast } from '../../../components/AppToastProvider'
import errorMessages from '../../../components/ErrorMessages'

const AccessToken = () => {
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState({
        apiToken: [],
        deny: true,
    })

    const handleDeactivation = async () => {
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()
        await axios
            .post(
                `${VITE_APP_API_URL}/api/v1/sec/management/apikeys/deactivate`,
                {
                    recaptcha_ref: recaptcha,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                    },
                },
            )
            .then((response) => {
                if (!response.data.error) return window.location.reload()
            })
            .catch((error) => {
                console.error(error)
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    const fetchData = async () => {
        await axios
            .get(`${VITE_APP_API_URL}/api/v1/sec/management/apikeys`, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => {
                if (!response.data.error) setResult(response.data)
            })
            .catch((error) => {
                console.error(error)
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

            {!loading && (
                <>
                    <h4>Deactivate all apikeys</h4>
                    <CCard className="mb-3">
                        <CCardBody>
                            <p>Clearing all active apikeys will deny future incoming requests.</p>
                            <CButton
                                type="submit"
                                color="danger"
                                className="mt-4 d-block me-2 rounded"
                                disabled={result.deny}
                                onClick={handleDeactivation}
                            >
                                Deactivate all apikeys
                            </CButton>
                        </CCardBody>
                    </CCard>
                    <CCard>
                        <CCardBody>
                            <CCardTitle>API keys</CCardTitle>
                            <CTable hover responsive>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell className="text-muted poppins-regular">
                                            #
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="text-muted poppins-regular">
                                            User
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="text-muted poppins-regular">
                                            Status
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="text-muted poppins-regular">
                                            Token
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="text-muted poppins-regular">
                                            Whitelist
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="text-muted poppins-regular">
                                            Last Accessed
                                        </CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {result.apiToken.map((token, index) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>{token.user_id}</CTableDataCell>
                                            <CTableDataCell>
                                                {token.active ? 'Active' : 'Inactive'}
                                            </CTableDataCell>
                                            <CTableDataCell>{token.token}</CTableDataCell>
                                            <CTableDataCell>
                                                {token.whitelist_ip
                                                    .map((ip) => ip.split(',')[0])
                                                    .join(' ')}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {token.last_accessed
                                                    ? parseTimestamp(token.last_accessed)
                                                    : 'Never'}
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </>
            )}
        </div>
    )
}

export default AccessToken
