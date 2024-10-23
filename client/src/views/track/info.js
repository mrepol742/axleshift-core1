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
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [responseData, setResponseData] = useState({
        events: [],
        origin: '',
        destination: '',
        status: '',
        markerPositions: [],
    })
    const { id } = useParams()

    const fetchData = async () => {
        setLoading(true)
        await axios
            .get(`${VITE_APP_API_URL}/api/v1/track/${id}`, {
                headers: {
                    Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                },
            })
            .then((response) => {
                setResponseData(response.data)
            })
            .catch((error) => {
                console.error(error)
                setError(true)
            })
            .finally(() => {
                setLoading(false)
            })
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

            {error && <Page404 />}

            {!error && (
                <>
                    <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                        <CCol>
                            <div className="mb-4">
                                <CCard className="mb-3 bg-dark text-white p-3">
                                    <CCardText> #{id}</CCardText>
                                    Origin: {responseData.origin} | Destination:{' '}
                                    {responseData.destination} | Status: {responseData.status}
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
                                        <div className="timeline-date">{event.date}</div>
                                        <div className="timeline-content">
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
