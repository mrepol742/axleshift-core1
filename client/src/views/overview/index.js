import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow, parseISO } from 'date-fns'
import Cookies from 'js-cookie'
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
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import WidgetsDropdown from './widgets'
import AppSearch from '../../components/AppSearch'
import AppPagination from '../../components/AppPagination'

const Overview = () => {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [query, setQuery] = useState('')
    const navigate = useNavigate()

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        fetchData(0, query)
    }

    const fetchData = async (page, query) => {
        await axios
            .post(
                `${import.meta.env.VITE_APP_API_URL}/api/v1/freight`,
                { page, q: query },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_APP_SESSION)}`,
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
    }

    useEffect(() => {
        fetchData(currentPage, query)
    }, [currentPage])

    return (
        <>
            <WidgetsDropdown className="mb-4" />
            <AppSearch
                className="mb-4"
                handleSearchSubmit={handleSearchSubmit}
                query={query}
                setQuery={setQuery}
            />

            <CRow>
                {data.map((item) => (
                    <CCol
                        key={item._id}
                        sm={6}
                        xl={4}
                        xxl={3}
                        className="mb-3"
                        onClick={() => navigate(`/v/${item._id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <CCard>
                            <CCardHeader
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <span></span>
                                <div>
                                    {formatDistanceToNow(parseISO(item.created_at), {
                                        addSuffix: true,
                                    })}
                                </div>
                            </CCardHeader>
                            <CCardBody>
                                <blockquote className="blockquote mb-0">
                                    <p>{item.data.shipment.shipment_description}</p>
                                    <footer className="blockquote-footer">{item.type}</footer>
                                </blockquote>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>

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
