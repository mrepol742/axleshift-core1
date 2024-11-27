import React, { useEffect, useState } from 'react'
import { CFormInput, CForm, CRow, CCol, CCard, CButton, CSpinner, CCardBody } from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faEye, faEyeSlash, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { VITE_APP_RECAPTCHA_SITE_KEY } from '../../config'
import { useToast } from '../../components/AppToastProvider'
import errorMessages from '../../utils/ErrorMessages'
import parseTimestamp from '../../utils/Timestamp'

const API = () => {
    const { addToast } = useToast()
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
            addToast('API Key copied!')
        } catch (err) {
            console.log(err)
            addToast('Failed... no idea why.')
        }
    }

    const gen = async () => {
        setLoading(true)
        const recaptcha = await recaptchaRef.current.executeAsync()
        axios
            .post(`/auth/token/new`, {
                recaptcha_ref: recaptcha,
            })
            .then((response) =>
                setResult((prevResult) => ({
                    ...prevResult,
                    token: response.data.token,
                })),
            )
            .catch((error) => {
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    const fetchData = async () => {
        axios
            .get(`/auth/token/`)
            .then((response) => setResult(response.data))
            .catch((error) => {
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message)
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
        addToast('Max number of whitelisted ip address reached')
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
        axios
            .post(`/auth/token/whitelist-ip`, {
                whitelist_ip: result.whitelist_ip.toString(),
                recaptcha_ref: recaptcha,
            })
            .then((response) => {
                if (response.data.error) return addToast(response.data.error)
                addToast('Your changes has been saved.')
            })
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

            {!loading && !result.token && (
                <CRow className="justify-content-center my-5">
                    <CCol md={6}>
                        <div className="clearfix">
                            <h1 className="float-start display-3 me-4">OOPS</h1>
                            <h4>You have not generate a token yet.</h4>
                            <CButton color="primary" size="sm" onClick={gen}>
                                Generate Token
                            </CButton>
                        </div>
                    </CCol>
                </CRow>
            )}
            {!loading && result.token && (
                <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                    <CCol className="mb-3">
                        <h4>Auth token</h4>
                        <CCard>
                            <CCardBody>
                                <div className="d-flex mb-3">
                                    <CFormInput
                                        className={isBlurred ? 'blurred' : ''}
                                        value={result.token}
                                        aria-describedby="basic-addon"
                                    />
                                    <CButton className="ms-2" onClick={handleIconClick}>
                                        <FontAwesomeIcon icon={isBlurred ? faEye : faEyeSlash} />
                                    </CButton>
                                    <CButton className="ms-2" onClick={copyToClipboard}>
                                        <FontAwesomeIcon icon={faCopy} />
                                    </CButton>
                                </div>
                                <CButton color="primary" size="sm" onClick={gen}>
                                    New token
                                </CButton>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol className="mb-3">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <h4>Whitelisted IP</h4>
                            <CButton
                                size="sm"
                                className="text-white"
                                onClick={handleAddIp}
                                disabled={disabledAdd}
                            >
                                <FontAwesomeIcon icon={faPlus} /> Add
                            </CButton>
                        </div>
                        {result.whitelist_ip && result.whitelist_ip.length === 0 && (
                            <CCard className="mb-3">
                                <CCardBody className="justify-content-center m-3">
                                    <div className="clearfix">
                                        <h1 className="float-start display-3 me-4">OOPS</h1>
                                        <h4>There was no Whitelisted IP Addresses.</h4>
                                        <p>Add new one to begin</p>
                                    </div>
                                </CCardBody>
                            </CCard>
                        )}

                        {result.whitelist_ip && result.whitelist_ip.length !== 0 && (
                            <CCard className="mb-3">
                                <CCardBody>
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
                                            size="sm"
                                            type="submit"
                                            color="primary"
                                            className="d-block me-2 rounded"
                                        >
                                            Save changes
                                        </CButton>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        )}

                        <h4>Last accessed</h4>
                        <CCard>
                            <CCardBody>
                                <p className="display-5">
                                    {result.last_accessed
                                        ? parseTimestamp(result.last_accessed)
                                        : 'Never'}
                                </p>
                                <span className="lead">{result.user_agent}</span>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            )}
        </div>
    )
}

export default API
