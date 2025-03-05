import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CCard,
    CCardBody,
    CCardText,
    CCardHeader,
    CSpinner,
    CRow,
    CCol,
    CButton,
} from '@coreui/react'
import Masonry from 'react-masonry-css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlaneDeparture, faTruck, faShip } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../components/AppToastProvider'
import errorMessages from '../../utils/ErrorMessages'

const Couriers = () => {
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])
    const navigate = useNavigate()

    const fetchData = async () => {
        axios
            .get(`/couriers`)
            .then((response) => setResult(response.data))
            .catch((error) => {
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    return (
        <div>
            <CRow className="align-items-center mb-2">
                <CCol>
                    <h4 className="mb-0">Partner Couriers</h4>
                </CCol>
                <CCol className="text-right d-flex justify-content-end">
                    <CButton color="primary">
                        New
                    </CButton>
                    <CButton color="danger" className="ms-2">
                        Delete
                    </CButton>
                </CCol>
            </CRow>
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
                {result.map((courier, index) => (
                    <div key={index}>
                        <CCard className="bg-dark text-white mb-3" style={{ cursor: 'pointer' }}>
                            <CCardHeader
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <div></div>
                                <div>{courier.name}</div>
                            </CCardHeader>
                            <CCardBody>
                                <CCardText></CCardText>
                            </CCardBody>
                        </CCard>
                    </div>
                ))}
            </Masonry>
        </div>
    )
}

export default Couriers
