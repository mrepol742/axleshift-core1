import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
    CButton,
} from '@coreui/react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useToast } from '../../components/AppToastProvider'

const Receipt = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const invoiceRef = React.useRef()
    const pdfRef = React.useRef()

    const generatePDF = () => {
        if (pdfRef.current) pdfRef.current.style.display = 'none'

        html2canvas(invoiceRef.current, { scale: 2 })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png')
                const pdf = new jsPDF('p', 'mm', 'a4')
                const imgWidth = 210
                const imgHeight = (canvas.height * imgWidth) / canvas.width
                pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight)
                pdf.save(`Invoice-${id}.pdf`)
            })
            .catch((error) => console.error('Error generating PDF:', error))
            .finally(() => {
                if (pdfRef.current) pdfRef.current.style.display = 'block'
            })
    }

    const fetchData = async () => {
        axios
            .get(`/invoices/${id}`)
            .then((response) => setData(response.data))
            .catch((error) => {
                const message =
                    error.response?.data?.error || 'Server is offline or restarting please wait'
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

    if (!data)
        return (
            <CRow className="justify-content-center my-5">
                <CCol md={6}>
                    <div className="clearfix">
                        <h1 className="float-start display-3 me-4">OOPS</h1>
                        <h4>There was no shipment invoice found.</h4>
                        <p>Double check tracking number for any mistake.</p>
                    </div>
                </CCol>
            </CRow>
        )

    return (
        <div ref={invoiceRef}>
            <CCard className="mb-4">
                <CCardBody>
                    <h3>Shipment Receipt</h3>
                    <CTable>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell>Tracking Number</CTableDataCell>
                                <CTableDataCell>{data.freight_tracking_number}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell>Reference Number</CTableDataCell>
                                <CTableDataCell>{data.invoice_id.slice(-8)}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell>User ID</CTableDataCell>
                                <CTableDataCell>{data.user_id}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell>Amount</CTableDataCell>
                                <CTableDataCell>
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: data.currency,
                                    }).format(data.amount)}
                                </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell>Status</CTableDataCell>
                                <CTableDataCell>{data.status}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell>Date</CTableDataCell>
                                <CTableDataCell>
                                    {new Date(data.created_at).toLocaleString()}
                                </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell>Last update</CTableDataCell>
                                <CTableDataCell>
                                    {new Date(data.created_at).toLocaleString()}
                                </CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                    <CButton className="btn btn-primary px-4" ref={pdfRef} onClick={generatePDF}>
                        Print
                    </CButton>
                </CCardBody>
            </CCard>
        </div>
    )
}

export default Receipt
