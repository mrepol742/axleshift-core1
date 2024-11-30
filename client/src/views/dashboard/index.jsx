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
import errorMessages from '../../utils/ErrorMessages'
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
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message, 'Submit failed!')
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData(currentPage)
    }, [currentPage])

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}

            {!loading && data.length == 0 && (
                <CRow className="justify-content-center my-5">
                    <CCol md={7}>
                        <div className="clearfix">
                            <h2>Track your shipment</h2>
                            <AppSearch className="mb-3" />
                            <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                                <CCol onClick={(e) => navigate('/freight')} className="mb-3">
                                    <CCard>
                                        <CCardBody>
                                            <CCardTitle>Ship right now</CCardTitle>
                                            <CCardText>Find the right service</CCardText>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                                <CCol onClick={(e) => navigate('/routes')} className="mb-3">
                                    <CCard>
                                        <CCardBody>
                                            <CCardTitle>Get a qoute</CCardTitle>
                                            <CCardText>Estimate cost and compare</CCardText>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                        </div>
                    </CCol>
                </CRow>
            )}

            {data.length !== 0 && (
                <>
                    <WidgetsDropdown className="mb-4" />

                    <h4>Shipments</h4>
                    <AppSearch className="mb-3 d-block d-md-none" />
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

                    {data.length > 20 && (
                        <AppPagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            setTotalPages={setTotalPages}
                            className="mb-3"
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default Dashboard
