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
            .post(`/freight`, { page })
            .then((response) => {
                setData(response.data.data)
                setTotalPages(response.data.totalPages)
            })
            .catch((error) => {
                const message =
                    error.response?.data?.error || 'Server is offline or restarting please wait'
                addToast(message, 'Submit failed!')
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

    if (data.length == 0)
        return (
            <>
                <div className="shipment-bg position-absolute top-0 start-0 w-100 h-100" />
                <CRow className="justify-content-center my-5">
                    <CCol md={7}>
                        <div className="text-center">
                            <h1 className="display-4 fw-bold">
                                Welcome to
                                <span className="text-primary d-block">Your Documents</span>
                            </h1>
                            <p className="lead">
                                It looks like you haven&apos;t created any shipments yet. Let&apos;s
                                get started!
                            </p>
                            <AppSearch className="mb-3" />
                        </div>
                        <CRow xs={{ cols: 1 }} sm={{ cols: 3 }}>
                            <CCol onClick={(e) => navigate('/book-now')} className="mb-3">
                                <h4>Ship Right Now</h4>
                                <p>Create a new shipment and get started with our services.</p>
                            </CCol>
                            <CCol onClick={(e) => navigate('/support')} className="mb-3">
                                <h4>Customer Support</h4>
                                <p>
                                    Get help with your shipments or learn more about our services.
                                </p>
                            </CCol>
                            <CCol onClick={(e) => navigate('/learn-more')} className="mb-3">
                                <h4>Learn More</h4>
                                <p>Find out more about our services and how we can help you.</p>
                            </CCol>
                        </CRow>
                    </CCol>
                </CRow>
            </>
        )

    return (
        <div>
            <CTable stripedColumns hover responsive>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">Tracking Number</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Items</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Import</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Danger Goods</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col"></CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {data.map((item, index) => (
                        <CTableRow key={index}>
                            <CTableDataCell>{item.tracking_number}</CTableDataCell>
                            <CTableDataCell className="text-capitalize">{item.type}</CTableDataCell>
                            <CTableDataCell>{item.number_of_items}</CTableDataCell>
                            <CTableDataCell>
                                {item.is_import === 'true' ? 'Yes' : 'No'}
                            </CTableDataCell>
                            <CTableDataCell>
                                {item.contains_danger_goods === 'true' ? 'Yes' : 'No'}
                            </CTableDataCell>
                            <CTableDataCell className="text-capitalize">
                                {item.status.replace('_', ' ')}
                            </CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    className="btn btn-primary"
                                    onClick={(e) => navigate(`/documents/${item.tracking_number}`)}
                                >
                                    Upload
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
        </div>
    )
}

export default Documents
