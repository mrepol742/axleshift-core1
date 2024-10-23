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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_API_URL, VITE_APP_SESSION } from '../../config'
import errorMessages from '../../components/http/ErrorMessages'

const API = () => {
    const [loading, setLoading] = useState(false)
    const recaptchaRef = React.useRef()
    const [isBlurred, setIsBlurred] = useState(true)
    const [result, setResult] = useState(null)
    const [message, setMessage] = useState('')

    const handleIconClick = () => {
        setIsBlurred((prev) => !prev)
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(result)
            setMessage('API Key copied!')
        } catch (err) {
            console.log(err)
            setMessage('Failed... no idea why.')
        }
    }

    const gen = async () => {
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()

        const formData = new FormData()
        formData.append('recaptcha_ref', recaptcha)

        await axios
            .post(`${VITE_APP_API_URL}/api/v1/auth/token/new`, formData, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => {
                setResult(response.data.token)
                setMessage('')
            })
            .catch((error) => {
                console.error(error)
                const message = errorMessages[error.status] || 'An unexpected error occurred'
                setMessage(message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const fetchData = async () => {
        setLoading(true)
        await axios
            .get(`${VITE_APP_API_URL}/api/v1/auth/token/`, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => {
                setResult(response.data.token)
                setMessage('')
            })
            .catch((error) => {
                console.error(error)
                const message = errorMessages[error.status] || 'An unexpected error occurred'
                setMessage(message)
            })
            .finally(() => {
                setLoading(false)
            })
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
            <h3>Auth token</h3>
            {!result && (
                <div className="text-center border rounded mb-4">
                    <div className="p-0 p-md-5 my-5 my-md-0">
                        <CImage src="/images/threat.png" fluid width="50%" />
                        <h1>There was no API Token</h1>
                        <CButton color="primary" onClick={gen}>
                            Generate Token
                        </CButton>
                        <p>{message}</p>
                    </div>
                </div>
            )}
            {result && (
                <>
                    <div className="text-center border rounded mb-4">
                        <div className="p-2 p-md-5 my-5 my-md-0">
                            <CInputGroup className="mb-3">
                                <CFormInput
                                    className={isBlurred ? 'blurred' : ''}
                                    value={result}
                                    aria-describedby="basic-addon"
                                />
                                <CInputGroupText id="basic-addon" onClick={handleIconClick}>
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                </CInputGroupText>
                                <CInputGroupText id="basic-addon" onClick={copyToClipboard}>
                                    <FontAwesomeIcon icon={faCopy} />
                                </CInputGroupText>
                            </CInputGroup>
                            <CButton color="secondary" onClick={gen}>
                                Generate new token
                            </CButton>
                            <p>{message}</p>
                        </div>
                    </div>
                </>
            )}

            <h3>Whitelisted IP address</h3>
        </div>
    )
}

export default API
