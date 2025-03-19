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
} from '@coreui/react'
import Masonry from 'react-masonry-css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import WidgetsDropdown from './Widgets'
import AppPagination from '../../components/AppPagination'
import { useToast } from '../../components/AppToastProvider'

import AppSearch from '../../components/AppSearch'
import ShipmentCard from './ShipmentCard'

const Dashboard = () => {
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
                                <span className="text-primary d-block">Your Dashboard</span>
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
            <AppSearch className="mb-3 d-block d-md-none" />
            <WidgetsDropdown className="mb-4" />

            <h4>Shipments</h4>
            <Masonry
                breakpointCols={{
                    default: 4,
                    1100: 3,
                    700: 2,
                    500: 1,
                }}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {data.map((item, index) => (
                    <ShipmentCard key={index} shipment={item} />
                ))}
            </Masonry>

            <button
                className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-3"
                style={{ width: '50px', height: '50px', fontSize: '20px' }}
                onClick={(e) => navigate('/customer')}
            >
                <FontAwesomeIcon icon={faQuestion} />
            </button>

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

export default Dashboard
