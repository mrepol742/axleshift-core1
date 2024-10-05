import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
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

const FreightInfo = () => {
    const [data, setData] = useState([])
    const [error, setError] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_URL}/api/v1/freight/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_APP_SESSION)}`,
                    },
                },
            )

            if (response.status !== 200) return setError(true)
            setData(response.data.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            <h1>Current Path ID: {id}</h1>
        </div>
    )
}

export default FreightInfo
