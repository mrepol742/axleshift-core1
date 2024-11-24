import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CCard,
    CCardGroup,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CPagination,
    CPaginationItem,
    CSpinner,
    CCardText,
    CFormSelect,
    CContainer,
} from '@coreui/react'
import Masonry from 'react-masonry-css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faMagnifyingGlass,
    faEllipsisVertical,
    faLocationDot,
    faPlaneDeparture,
    faTruck,
    faShip,
} from '@fortawesome/free-solid-svg-icons'
import WidgetsDropdown from './Widgets'
import { VITE_APP_API_URL, VITE_APP_SESSION } from '../../config'
import AppPagination from '../../components/AppPagination'
import { parseTimestamp } from '../../components/Timestamp'
import { useToast } from '../../components/AppToastProvider'
import errorMessages from '../../components/ErrorMessages'

const Dashboard = () => {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(true)
    const { addToast } = useToast()
    const navigate = useNavigate()

    const fetchData = async (page) => {
        await axios
            .post(
                `${VITE_APP_API_URL}/api/v1/freight`,
                { page },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                    },
                },
            )
            .then((response) => {
                setData(response.data.data)
                setTotalPages(response.data.totalPages)
            })
            .catch((error) => {
                console.error(error)
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
        <>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}

            {!loading && data.length == 0 && (
                <CRow className="justify-content-center my-5">
                    <CCol md={6}>
                        <div className="clearfix">
                            <h1 className="float-start display-3 me-4">OOPS</h1>
                            <h4>There was no shipment yet.</h4>
                            <p>Check it out later</p>
                        </div>
                    </CCol>
                </CRow>
            )}

            {data.length !== 0 && (
                <>
                    <WidgetsDropdown className="mb-4" />
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
                        {data.map((item) => (
                            <CCard
                                className="mb-3"
                                key={item._id}
                                onClick={() => navigate(`/v/${item._id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <CCardHeader
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div>
                                        {item.type == 'air' && (
                                            <FontAwesomeIcon icon={faPlaneDeparture} />
                                        )}
                                        {item.type == 'land' && <FontAwesomeIcon icon={faTruck} />}
                                        {item.type == 'sea' && <FontAwesomeIcon icon={faShip} />}
                                    </div>
                                    <div>{parseTimestamp(item.created_at)}</div>
                                </CCardHeader>
                                <CCardBody>
                                    <CCardText>{item.data.shipment.shipment_description}</CCardText>
                                </CCardBody>
                                <CCardFooter className="bg-dark text-white border-0 small">
                                    Status: {item.status}
                                </CCardFooter>
                            </CCard>
                        ))}
                    </Masonry>
                    <AppPagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                        setTotalPages={setTotalPages}
                        className="mb-3"
                    />
                </>
            )}
        </>
    )
}

export default Dashboard
