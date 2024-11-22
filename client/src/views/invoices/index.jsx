import React, { useState, useEffect } from 'react'
import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CSpinner,
    CRow,
    CCol,
} from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_API_URL, VITE_APP_SESSION } from '../../config'
import { useToast } from '../../components/AppToastProvider'
import errorMessages from '../../components/ErrorMessages'
import { parseTimestamp } from '../../components/Timestamp'

const Invoices = () => {
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])

    const fetchData = async () => {
        await axios
            .get(`${VITE_APP_API_URL}/api/v1/invoices`, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => setResult(response.data))
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

            {result.length === 0 && (
                <CRow className="justify-content-center my-5">
                    <CCol md={6}>
                        <div className="clearfix">
                            <h1 className="float-start display-3 me-4">OOPS</h1>
                            <h4>There was no invoices yet.</h4>
                            <p>Check it out later</p>
                        </div>
                    </CCol>
                </CRow>
            )}

            {result.length !== 0 && (
                <CTable hover responsive className="rounded-5 border border-2">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell className="text-muted poppins-regular">
                                Actor
                            </CTableHeaderCell>
                            <CTableHeaderCell className="text-muted poppins-regular">
                                Type
                            </CTableHeaderCell>
                            <CTableHeaderCell className="text-muted poppins-regular">
                                Message
                            </CTableHeaderCell>
                            <CTableHeaderCell className="text-muted poppins-regular">
                                Created At
                            </CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {result.map((log) => (
                            <CTableRow key={log._id}>
                                <CTableDataCell>You</CTableDataCell>
                                <CTableDataCell>{log.type}</CTableDataCell>
                                <CTableDataCell>{log.message}</CTableDataCell>
                                <CTableDataCell>{parseTimestamp(log.created_at)}</CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            )}
        </div>
    )
}

export default Invoices
