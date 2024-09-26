import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
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

import WidgetsDropdown from './widgets/WidgetsDropdown'
import Search from '../../components/overview/Search.js'

const Overview = () => {
    const [data, setData] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(
                    'http://localhost:5050/api/freight',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${Cookies.get('RCTSESSION')}`,
                        },
                    },
                )
                if (response.data.status == 200) setData(response.data.data)
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [])

    return (
        <>
            <WidgetsDropdown className="mb-4" />
            <Search className="mb-4" />

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
                            <CCardHeader>#{item._id}</CCardHeader>
                            <CCardBody>
                                <blockquote className="blockquote mb-0">
                                    <p>{item.created_at}</p>
                                    <footer className="blockquote-footer">{item.type}</footer>
                                </blockquote>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>

            <CPagination aria-label="Page navigation example">
                <CPaginationItem>Previous</CPaginationItem>
                <CPaginationItem>1</CPaginationItem>
                <CPaginationItem>2</CPaginationItem>
                <CPaginationItem>3</CPaginationItem>
                <CPaginationItem>Next</CPaginationItem>
            </CPagination>
        </>
    )
}

export default Overview
