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
} from '@fortawesome/free-solid-svg-icons'
import WidgetsDropdown from './Widgets'
import { VITE_APP_API_URL, VITE_APP_SESSION } from '../../config'
import AppPagination from '../../components/AppPagination'
import { parseTimestamp } from '../../components/Timestamp'
import { useToast } from '../../components/AppToastProvider'
import errorMessages from '../../components/ErrorMessages'

const Overview = () => {
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
                const message = errorMessages[error.status] || 'Internal Application Error'
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

            <WidgetsDropdown className="mb-4" />

            {!loading && data.length == 0 && (
                <CRow className="justify-content-center my-5">
                    <CCol md={6}>
                        <div className="clearfix">
                            <h1 className="float-start display-3 me-4">OOPS</h1>
                            <h4>You don&apos;t have any shipment yet.</h4>
                            <p
                                className="text-body-secondary float-start text-decoration-underline"
                                onClick={(e) => navigate('/freight')}
                            >
                                Wanna add one? Click here.
                            </p>
                        </div>
                    </CCol>
                </CRow>
            )}

            {data.length !== 0 && (
                <>
                    <CForm className="d-block d-sm-flex justify-content-left my-2 my-lg-0">
                        <CFormSelect
                            options={[
                                { label: 'All', value: '0' },
                                { label: 'On Route', value: '1' },
                                { label: 'Canceled', value: '2' },
                                { label: 'Shipped', value: '3' },
                            ]}
                            className="mb-3"
                        />
                        <div className="mx-2"></div>
                        <CFormSelect
                            options={[
                                { label: 'Newer', value: '1' },
                                { label: 'Older', value: '2' },
                            ]}
                            className="mb-3"
                        />
                        <div className="mx-2"></div>
                        <AppPagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            setTotalPages={setTotalPages}
                            className="mb-3"
                        />
                    </CForm>

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
                                    <div></div>
                                    <div>{parseTimestamp(item.created_at)}</div>
                                </CCardHeader>
                                <CCardBody>
                                    <CCardText>{item.data.shipment.shipment_description}</CCardText>
                                </CCardBody>
                                <CCardFooter className="bg-dark text-white border-0">
                                    Status: On route
                                </CCardFooter>
                            </CCard>
                        ))}
                    </Masonry>
                </>
            )}
        </>
    )
}

export default Overview
