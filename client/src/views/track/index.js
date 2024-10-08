import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CInputGroup, CFormInput, CInputGroupText, CForm, CRow, CCol, CImage } from '@coreui/react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const Track = () => {
    const [trackingID, setTrackingID] = useState('')
    const navigate = useNavigate()

    const handleSubmit = () => {
        navigate(`/track/${trackingID}`)
    }

    return (
        <CRow>
            <CCol xs={3} className="image-container d-none d-md-flex">
                <CImage fluid rounded src="/images/freight-track.jpg" className="custom-image" />
            </CCol>
            <CCol md={7}>
                <h1>Enter Tracking ID</h1>
                <CForm className="mb-3" onSubmit={handleSubmit}>
                    <CInputGroup>
                        <CFormInput
                            aria-label="tracking id"
                            aria-describedby="basic-addon"
                            onChange={(e) => setTrackingID(e.target.value)}
                        />
                        <CInputGroupText id="basic-addon">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </CInputGroupText>
                    </CInputGroup>
                </CForm>
            </CCol>
        </CRow>
    )
}

export default Track
