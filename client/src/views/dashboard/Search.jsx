import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CForm, CFormSelect, CSpinner, CRow, CCol } from '@coreui/react'
import Masonry from 'react-masonry-css'
import { useToast } from '../../components/AppToastProvider'
import AppSearch from '../../components/AppSearch'
import ShipmentCard from './ShipmentCard'
import AppPagination from '../../components/AppPagination'

const AppBar = () => {
    return (
        <>
            <AppSearch className="mb-3 d-block d-md-none" />

            <CForm className="d-block d-sm-flex justify-content-left">
                <CFormSelect
                    options={[
                        { label: 'Select status', value: '0' },
                        { label: 'To Pay', value: '1' },
                        { label: 'To Ship', value: '2' },
                        { label: 'To Receive', value: '3' },
                        { label: 'Received', value: '4' },
                        { label: 'Cancelled', value: '5' },
                    ]}
                    className="mb-3"
                />
                <div className="mx-2"></div>
                <CFormSelect
                    options={[
                        { label: 'Select data', value: '0' },
                        { label: 'Newer', value: '1' },
                        { label: 'Older', value: '2' },
                    ]}
                    className="mb-3"
                />
                <div className="mx-2"></div>
                <CFormSelect
                    options={[
                        { label: 'Select freight', value: '0' },
                        { label: 'Sea Freight', value: '1' },
                        { label: 'Land Freight', value: '2' },
                        { label: 'Air Freight', value: '3' },
                    ]}
                    className="mb-3"
                />
            </CForm>
        </>
    )
}
const Search = () => {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(true)
    const { addToast } = useToast()
    const navigate = useNavigate()
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('q') ? urlParams.get('q') : ''

    const fetchData = async (page) => {
        axios
            .post(`/freight`, { page, query })
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

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    if (data.length == 0)
        return (
            <>
                <AppBar />
                <CRow className="justify-content-center my-5">
                    <CCol md={6}>
                        <div className="clearfix">
                            <h1 className="float-start display-3 me-4">OOPS</h1>
                            <h4>There was no shipment found.</h4>
                            <p>Double check your search query.</p>
                        </div>
                    </CCol>
                </CRow>
            </>
        )

    return (
        <div>
            <AppBar />
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

            {data.length > 20 && (
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

export default Search
