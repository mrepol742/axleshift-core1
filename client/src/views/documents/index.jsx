import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CRow,
    CSpinner,
    CCardText,
    CCardTitle,
    CTable,
    CTableBody,
    CTableHeaderCell,
    CTableRow,
    CTableHead,
    CTableDataCell,
    CButton,
} from '@coreui/react'
import Masonry from 'react-masonry-css'
import AppPagination from '../../components/AppPagination'
import { useToast } from '../../components/AppToastProvider'
import AppSearch from '../../components/AppSearch'

const Documents = () => {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(true)
    const { addToast } = useToast()
    const navigate = useNavigate()

    const fetchData = async (page) => {
        axios
            .post(`/documents`, { page })
            .then((response) => {
                setData(response.data.data)
                setTotalPages(response.data.totalPages)
            })
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
        fetchData(currentPage)
    }, [currentPage])

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    if (data.length === 0)
        return (
            <CRow className="justify-content-center my-5">
                <CCol md={6}>
                    <div className="clearfix">
                        <h1 className="float-start display-3 me-4 text-danger">OOPS</h1>
                        <h4>There was no documents yet.</h4>
                        <p>Check it out later</p>
                    </div>
                </CCol>
            </CRow>
        )

    return (
        <div>
            <CCard className="mb-4">
                <CCardBody>
                    <CCardTitle>Shipment Documents</CCardTitle>
                    <CTable stripedColumns hover responsive className="table-even-width">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell className="text-uppercase fw-bold text-muted poppins-regular table-header-cell-no-wrap">
                                    Tracking Number
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-uppercase fw-bold text-muted poppins-regular table-header-cell-no-wrap">
                                    Status
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-uppercase fw-bold text-muted poppins-regular table-header-cell-no-wrap">
                                    Documents
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-uppercase fw-bold text-muted poppins-regular table-header-cell-no-wrap"></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {data.map((item, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>{item.freight_tracking_number}</CTableDataCell>
                                    <CTableDataCell className="text-uppercase">
                                        <span
                                            className={`badge bg-${item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'danger' : 'warning'}`}
                                        >
                                            {item.status}
                                        </span>
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        {item.documents.length === 0
                                            ? 'No documents found'
                                            : JSON.stringify(documents)}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        <CButton
                                            className="btn btn-primary"
                                            onClick={(e) =>
                                                navigate(
                                                    `/documents/${item.freight_tracking_number}`,
                                                )
                                            }
                                        >
                                            View
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>

                    {totalPages > 1 && (
                        <AppPagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            setTotalPages={setTotalPages}
                            className="mb-3"
                        />
                    )}
                </CCardBody>
            </CCard>
        </div>
    )
}

export default Documents
