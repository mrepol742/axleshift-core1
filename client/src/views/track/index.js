import React, { useEffect, useState } from 'react'
import { CInputGroup, CFormInput, CInputGroupText, CForm, CRow, CCol } from '@coreui/react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const Tracking = () => {
    const [trackingID, setTrackingID] = useState('')

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const q = params.get('q')
        if (q) {
            setTrackingID(q)
        }
    }, [])

    const mapContainerStyle = {
        height: '400px',
        width: '800px',
    }

    const center = {
        lat: -34.397,
        lng: 150.644,
    }

    const markerPosition = {
        lat: -34.397,
        lng: 150.644,
    }

    return (
        <>
            <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                <CCol>
                    {!trackingID && (
                        <>
                            <h1>Enter Tracking ID</h1>
                            <CForm method="get">
                                <CInputGroup className="mb-3">
                                    <CFormInput
                                        aria-label="tracking id"
                                        aria-describedby="basic-addon"
                                        name="q"
                                    />
                                    <CInputGroupText id="basic-addon" type="submit">
                                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                                    </CInputGroupText>
                                </CInputGroup>
                            </CForm>
                        </>
                    )}
                </CCol>
                <CCol></CCol>
            </CRow>
            {trackingID && (
                <div>
                    <h3>Status: on route</h3>
                    <span>Location: test test </span>
                    <LoadScript googleMapsApiKey={import.meta.env.VITE_APP_GOOGLE_MAP}>
                        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}>
                            <Marker position={markerPosition} />
                        </GoogleMap>
                    </LoadScript>
                </div>
            )}
        </>
    )
}

export default Tracking
