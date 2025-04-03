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
    CImage,
} from '@coreui/react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Helmet } from 'react-helmet'
import { useToast } from '../../../components/AppToastProvider'

const Receipt = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const invoiceRef = React.useRef()
    const pdfRef = React.useRef()
    const generatePDF = () => {
        pdfRef.current.style.display = 'none'
        const bgColor = getComputedStyle(document.body).backgroundColor

        html2canvas(invoiceRef.current, {
            scale: 2,
            backgroundColor: bgColor,
        })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png')
                const pdf = new jsPDF('p', 'mm', 'a4')
                const imgWidth = 210
                const imgHeight = (canvas.height * imgWidth) / canvas.width

                pdf.setFillColor(bgColor)
                pdf.rect(
                    0,
                    0,
                    pdf.internal.pageSize.getWidth(),
                    pdf.internal.pageSize.getHeight(),
                    'F',
                )

                pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight)
                pdf.save(`Invoice-${id}.pdf`)
            })
            .catch((error) => console.error('Error generating PDF:', error))
            .finally(() => {
                pdfRef.current.style.display = 'block'
            })
    }

    const fetchData = async () => {
        axios
            .get(`/invoices/${id}`)
            .then((response) => setData(response.data))
            .catch((error) => {
                const message =
                    error.response?.data?.error ||
                    (error.message === 'network error'
                        ? 'Server is offline or restarting please wait'
                        : error.message)
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
                        <h1 className="float-start display-3 me-4 text-danger">OOPS</h1>
                        <h4>There was no shipment invoice found.</h4>
                        <p>Double check tracking number for any mistake.</p>
                    </div>
                </CCol>
            </CRow>
        )

    return (
        <div ref={invoiceRef}>
            <Helmet>
                <title>{id} - Invoice | Axleshift</title>
            </Helmet>
            <h1 className="text-uppercase fw-bold text-center">Axleshift</h1>
            <p className="text-center">4108 IM Bestlink College of the Phillippines</p>
            <div className="bg-body-secondary p-2 mb-1">
                <span className="d-block">Invoice ID: {data.invoice_id}</span>
                <span className="d-block">Tracking Number: {data.freight_tracking_number}</span>
                {data.freight_details.is_import === true ? (
                    <span>Name: {data.freight_details.to[0].name}</span>
                ) : (
                    <span>Name: {data.freight_details.from[0].name}</span>
                )}
                <br />
                <br />
                {data.freight_details.is_import === true ? (
                    <>
                        <span className="d-block">{data.freight_details.to[0].address}</span>
                        <span className="d-block">
                            {data.freight_details.to[0].city} {data.freight_details.to[0].zip_code}
                        </span>
                        <span>{data.freight_details.to[0].country}</span>
                    </>
                ) : (
                    <>
                        <span className="d-block">{data.freight_details.from[0].address}</span>
                        <span className="d-block">
                            {data.freight_details.from[0].city}{' '}
                            {data.freight_details.from[0].zip_code}
                        </span>
                        <span>{data.freight_details.from[0].country}</span>
                    </>
                )}
                <div className="mb-4" />
                {data.status === 'PAID' && (
                    <>
                        <div className="d-flex justify-content-between">
                            <span>Date Paid</span>
                            <span>{new Date(data.updated_at).toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Payment Method</span>
                            <span>{data.payment_method}</span>
                        </div>
                    </>
                )}
                <div className="d-flex justify-content-between">
                    <span>Amount Due</span>
                    <span>
                        {' '}
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: data.currency,
                        }).format(data.amount)}
                    </span>
                </div>
            </div>
            <div className="bg-body-secondary p-2 small mb-2">
                https://core1.axleshift.com/invoices/{id}
            </div>
            <div className="d-flex">
                {data.status === 'PENDING' && (
                    <CButton
                        className="btn btn-primary px-4 mb-3 me-2"
                        onClick={(e) =>
                            (window.location.href = `https://checkout-staging.xendit.co/web/${data.invoice_id}`)
                        }
                    >
                        PAY NOW
                    </CButton>
                )}
                <CButton className="btn btn-primary px-4 mb-3" ref={pdfRef} onClick={generatePDF}>
                    PDF
                </CButton>
            </div>
        </div>
    )
}

export default Receipt
