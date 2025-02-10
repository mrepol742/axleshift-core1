import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
    CCard,
    CCardBody,
    CCardTitle,
} from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY } from '../../config'
import { useToast } from '../../components/AppToastProvider'
import errorMessages from '../../utils/ErrorMessages'
import parseTimestamp from '../../utils/Timestamp'

const Invoices = () => {
    const recaptchaRef = React.useRef()
    const navigate = useNavigate()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])

    const fetchData = async () => {
        axios
            .get(`/invoices`)
            .then((response) => setResult(response.data))
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

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    if (result.length === 0)
        return (
            <CRow className="justify-content-center my-5">
                <CCol md={6}>
                    <div className="clearfix">
                        <h1 className="float-start display-3 me-4">OOPS</h1>
                        <h4>There was no invoices yet.</h4>
                        <p>Check it out later</p>
                    </div>
                </CCol>
            </CRow>
        )

    return (
        <div>
            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_APP_RECAPTCHA_SITE_KEY} />
            <CCard className="mb-4">
                <CCardBody>
                    <CCardTitle>Transactions</CCardTitle>
                    <CTable hover responsive>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell className="text-muted poppins-regular">
                                    Shipment ID
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-muted poppins-regular">
                                    Invoice ID
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-muted poppins-regular">
                                    Amount
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-muted poppins-regular">
                                    Status
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-muted poppins-regular">
                                    Last Update
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {result.map((invoice, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell
                                        onClick={(e) => navigate(`/v/${invoice.freight_id}`)}
                                    >
                                        {invoice.freight_id}
                                    </CTableDataCell>
                                    <CTableDataCell
                                        onClick={(e) =>
                                            (window.location.href = `https://checkout-staging.xendit.co/web/${invoice.invoice_id}`)
                                        }
                                    >
                                        {invoice.invoice_id}
                                    </CTableDataCell>
                                    <CTableDataCell>{`${invoice.amount} ${invoice.currency}`}</CTableDataCell>
                                    <CTableDataCell>{invoice.status}</CTableDataCell>
                                    <CTableDataCell>
                                        {parseTimestamp(invoice.updated_at)}
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>
        </div>
    )
}

export default Invoices
