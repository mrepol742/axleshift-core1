import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CRow, CCol, CCard, CCardText, CSpinner } from '@coreui/react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { VITE_APP_GOOGLE_MAP } from '../../config'

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
        axios
            .get(`/track/${id}`)
            .then((response) => setResponseData(response.data))
            .catch((error) => setError(true))
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

    if (error)
        return (
            <CRow className="justify-content-center my-5">
                <CCol md={6}>
                    <div className="clearfix">
                        <h1 className="float-start display-3 me-4 text-danger">OOPS</h1>
                        <h4>There was no shipment found.</h4>
                        <p>Double check tracking id for any mistake.</p>
                    </div>
                </CCol>
            </CRow>
        )

    return (
        <div>
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
                                onClick={(e) => navigate(`/shipment/${id}`)}
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
        </div>
    )
}

export default TrackInfo
