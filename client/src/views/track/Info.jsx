import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CForm,
    CRow,
    CCol,
    CCard,
    CCardText,
    CSpinner,
} from '@coreui/react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { VITE_APP_API_URL, VITE_APP_SESSION, VITE_APP_GOOGLE_MAP } from '../../config'
import Page404 from '../errors/404'

const TrackInfo = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [responseData, setResponseData] = useState({
        events: [],
        origin: '',
        destination: '',
        status: '',
        markerPositions: [],
    })
    const { id } = useParams()
    const navigate = useNavigate()

    const fetchData = async () => {
        await axios
            .get(`${VITE_APP_API_URL}/api/v1/track/${id}`, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => setResponseData(response.data))
            .catch((error) => {
                console.error(error)
                setError(true)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}

            {error && (
                <CRow className="justify-content-center my-5">
                    <CCol md={6}>
                        <div className="clearfix">
                            <h1 className="float-start display-3 me-4">OOPS</h1>
                            <h4>There was no shipment found.</h4>
                            <p>Double check tracking id for any mistake.</p>
                        </div>
                    </CCol>
                </CRow>
            )}

            {responseData.origin && (
                <>
                    <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                        <CCol>
                            <div className="mb-4">
                                <CCard className="mb-3 bg-dark text-white p-3">
                                    <CCardText> #{id}</CCardText>
                                    <div className="small">
                                        <b>From</b>: {responseData.origin} <br />
                                        <b>To</b>: {responseData.destination} <br />
                                        <b>Status</b>: {responseData.status}
                                    </div>
                                    <div
                                        className="d-flex justify-content-end align-items-center text-primary"
                                        onClick={(e) => navigate(`/v/${id}`)}
                                    >
                                        View shipment information
                                    </div>
                                </CCard>
                                <LoadScript googleMapsApiKey={VITE_APP_GOOGLE_MAP}>
                                    <GoogleMap
                                        mapContainerStyle={{
                                            height: '400px',
                                            width: '100%',
                                        }}
                                        center={responseData.markerPositions[0]}
                                        zoom={10}
                                    >
                                        {responseData.markerPositions.map((position, index) => (
                                            <Marker key={index} position={position} />
                                        ))}
                                    </GoogleMap>
                                </LoadScript>
                            </div>
                        </CCol>
                        <CCol>
                            <div className="timeline">
                                {responseData.events.map((event, index) => (
                                    <div className="timeline-event" key={index}>
                                        <div className="text-primary px-4">{event.date}</div>
                                        <div className="px-4 py-1 mb-2">
                                            <p>{event.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CCol>
                    </CRow>
                </>
            )}
        </div>
    )
}

export default TrackInfo
