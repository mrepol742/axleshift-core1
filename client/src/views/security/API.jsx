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
import {
    faCopy,
    faEye,
    faEyeSlash,
    faPlus,
    faPen,
    faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_API_URL, VITE_APP_SESSION } from '../../config'
import errorMessages from '../../components/ErrorMessages'

const API = () => {
    const [loading, setLoading] = useState(true)
    const recaptchaRef = React.useRef()
    const [isBlurred, setIsBlurred] = useState(true)
    const [disabledAdd, setDisabledAdd] = useState(false)
    const [result, setResult] = useState({
        token: '',
        whitelist_ip: [],
    })

    const handleIconClick = () => {
        setIsBlurred((prev) => !prev)
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(result)
            alert('API Key copied!')
        } catch (err) {
            console.log(err)
            alert('Failed... no idea why.')
        }
    }

    const gen = async () => {
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()
        await axios
            .post(
                `${VITE_APP_API_URL}/api/v1/auth/token/new`,
                {
                    recaptcha_ref: recaptcha,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                    },
                },
            )
            .then((response) =>
                setResult((prevResult) => ({
                    ...prevResult,
                    token: response.data.token,
                })),
            )
            .catch((error) => {
                console.error(error)
                const message = errorMessages[error.status] || 'Internal Application Error'
                alert(message)
            })
            .finally(() => setLoading(false))
    }

    const fetchData = async () => {
        await axios
            .get(`${VITE_APP_API_URL}/api/v1/auth/token/`, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => {
                if (!response.data.error) setResult(response.data)
            })
            .catch((error) => {
                console.error(error)
                const message = errorMessages[error.status] || 'Internal Application Error'
                alert(message)
            })
            .finally(() => setLoading(false))
    }

    const handleAddIp = () => {
        if (!Array.isArray(result.whitelist_ip))
            return setResult((prev) => ({
                ...prev,
                whitelist_ip: [''],
            }))
        if (result.whitelist_ip.length < 6)
            return setResult((prev) => ({
                ...prev,
                whitelist_ip: [...prev.whitelist_ip, ''],
            }))
        alert('Max number of whitelisted ip address reached')
    }

    const handleIpChange = (index, value) => {
        const newInputs = [...result.whitelist_ip]
        newInputs[index] = value

        setResult((prevResult) => ({
            ...prevResult,
            whitelist_ip: newInputs,
        }))
    }

    const handleWhitelistIpSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()
        await axios
            .post(
                `${VITE_APP_API_URL}/api/v1/auth/token/whitelist-ip`,
                {
                    whitelist_ip: result.whitelist_ip,
                    recaptcha_ref: recaptcha,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                    },
                },
            )
            .then((response) => {
                if (response.data.error) return alert(response.data.error)
                alert('done')
            })
            .catch((error) => {
                console.error(error)
                const message = errorMessages[error.status] || 'Internal Application Error'
                alert(message)
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
                <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                    <CCol>
                        <h4>Auth token</h4>
                        {!result.token && (
                            <div className="text-center border rounded mb-4">
                                <div className="p-1 p-md-5 my-5 my-md-0">
                                    <CImage src="/images/threat.png" fluid width="50%" />
                                    <h4>There was no Auth Token</h4>
                                    <CButton color="primary" size="sm" onClick={gen}>
                                        Generate Token
                                    </CButton>
                                </div>
                            </div>
                        )}
                        {result.token && (
                            <div className="text-center border rounded mb-4">
                                <div className="p-2 p-md-3">
                                    <div className="d-flex mb-3">
                                        <CFormInput
                                            className={isBlurred ? 'blurred' : ''}
                                            value={result.token}
                                            aria-describedby="basic-addon"
                                        />
                                        <CButton className="ms-2" onClick={handleIconClick}>
                                            <FontAwesomeIcon
                                                icon={isBlurred ? faEye : faEyeSlash}
                                            />
                                        </CButton>
                                        <CButton className="ms-2" onClick={copyToClipboard}>
                                            <FontAwesomeIcon icon={faCopy} />
                                        </CButton>
                                    </div>
                                    <CButton color="primary" size="sm" onClick={gen}>
                                        Generate new token
                                    </CButton>
                                </div>
                            </div>
                        )}
                    </CCol>
                    <CCol>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <h4>Ip address</h4>
                            <CButton
                                color="success"
                                size="sm"
                                className="text-white"
                                onClick={handleAddIp}
                                disabled={disabledAdd}
                            >
                                <FontAwesomeIcon icon={faPlus} /> Create
                            </CButton>
                        </div>
                        {result.whitelist_ip.length === 0 && (
                            <div className="text-center border rounded mb-4">
                                <div className="p-2 p-md-3 my-5 my-md-0">
                                    <h6>There was no Whitelisted IP Addresses</h6>
                                </div>
                            </div>
                        )}

                        {result.whitelist_ip.length !== 0 && (
                            <div className="text-center border rounded mb-4">
                                <div className="p-2 p-md-3">
                                    <CForm onSubmit={handleWhitelistIpSubmit}>
                                        {result.whitelist_ip.map((input, index) => (
                                            <div className="d-flex mb-2" key={index}>
                                                <CFormInput
                                                    value={input}
                                                    onChange={(e) =>
                                                        handleIpChange(index, e.target.value)
                                                    }
                                                    placeholder={`192.168.0.${index + 1}`}
                                                />
                                                <CButton
                                                    color="danger"
                                                    className="text-white ms-2"
                                                    onClick={copyToClipboard}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </CButton>
                                            </div>
                                        ))}
                                        <CButton
                                            type="submit"
                                            color="primary"
                                            className="d-block me-2 rounded"
                                        >
                                            Save changes
                                        </CButton>
                                    </CForm>
                                </div>
                            </div>
                        )}
                    </CCol>
                </CRow>
            )}
        </div>
    )
}

export default API
