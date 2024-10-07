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
} from '@coreui/react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const TrackInfo = () => {
    const { id } = useParams()

    const mapContainerStyle = {
        height: '400px',
        width: '100%',
    }

    const center = {
        lat: -34.397,
        lng: 150.644,
    }

    const markerPosition = {
        lat: -34.397,
        lng: 150.644,
    }

    const events = [
        {
            date: '2024-07-10 03:02',
            description: 'Shipment is placed',
        },
        {
            date: '2024-07-11 07:51',
            description: 'We are preparing to ship your shipment',
        },
        {
            date: '2024-07-11 18:43',
            description: 'We shipped your shipment',
        },
        {
            date: '2024-07-14 04:18',
            description: 'Shipment has arrived on our ports in China',
        },
    ]

    return (
        <>
            <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                <CCol>
                    <div className="mb-4">
                        <CCard className="mb-3 bg-dark text-white p-3">
                            <CCardText>
                                <h5>#{id}</h5>
                                <span>Status: on route</span>
                            </CCardText>
                        </CCard>
                        <LoadScript googleMapsApiKey={import.meta.env.VITE_APP_GOOGLE_MAP}>
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={center}
                                zoom={10}
                            >
                                <Marker position={markerPosition} />
                            </GoogleMap>
                        </LoadScript>
                    </div>
                </CCol>
                <CCol>
                    <div className="timeline">
                        {events.map((event, index) => (
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
    )
}

export default TrackInfo
