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
} from '@coreui/react'
import Masonry from 'react-masonry-css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faMagnifyingGlass,
    faEllipsisVertical,
    faLocationDot,
} from '@fortawesome/free-solid-svg-icons'
import WidgetsDropdown from './widgets'
import AppSearch from '../../components/AppSearch'
import AppPagination from '../../components/AppPagination'
import { parseTimestamp } from '../../components/Timestamp'

const Overview = () => {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        fetchData(0, query)
    }

    const fetchData = async (page, query) => {
        setLoading(true)
        await axios
            .post(
                `${import.meta.env.VITE_APP_API_URL}/api/v1/freight`,
                { page, q: query },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.get(import.meta.env.VITE_APP_SESSION)}`,
                    },
                },
            )
            .then((response) => {
                setData(response.data.data)
                setTotalPages(response.data.totalPages)
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchData(currentPage, query)
    }, [currentPage])

    return (
        <>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}

            <WidgetsDropdown className="mb-4" />

            <CForm className="d-flex justify-content-left my-2 my-lg-0">
                <CInputGroup className="mb-3">
                    <CFormInput
                        aria-label="tracking id"
                        aria-describedby="basic-addon"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <CInputGroupText id="basic-addon">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </CInputGroupText>
                </CInputGroup>
                <div className="mx-2"></div>
                <CFormSelect
                    options={[
                        { label: 'All', value: '0' },
                        { label: 'On Route', value: '1' },
                        { label: 'Canceled', value: '2' },
                        { label: 'Shipped', value: '3' },
                    ]}
                    required
                    className="mb-3"
                />
                <div className="mx-2"></div>
                <CFormSelect
                    options={[
                        { label: 'Newer', value: '1' },
                        { label: 'Older', value: '2' },
                    ]}
                    required
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

            <AppPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                setTotalPages={setTotalPages}
            />
        </>
    )
}

export default Overview
