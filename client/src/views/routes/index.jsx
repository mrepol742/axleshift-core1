import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CCard,
    CCardBody,
    CCardText,
    CCardHeader,
    CSpinner,
    CForm,
    CInputGroup,
    CFormInput,
    CInputGroupText,
} from '@coreui/react'
import Masonry from 'react-masonry-css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { VITE_APP_GOOGLE_MAP } from '../../config'
import { useToast } from '../../components/AppToastProvider'
import errorMessages from '../../utils/ErrorMessages'

const Routes = () => {
    const { addToast } = useToast()
    const [loading, setLoading] = useState(false)
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const navigate = useNavigate()

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}
            <CForm className="mb-3">
                <CInputGroup>
                    <CFormInput
                        placeholder="Enter address"
                        aria-describedby="basic-addon"
                        style={{
                            height: '40px',
                            fontSize: '0.9em',
                        }}
                    />
                    <CInputGroupText id="basic-addon" className="px-3">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </CInputGroupText>
                </CInputGroup>
            </CForm>
            <CForm className="mb-3">
                <CInputGroup>
                    <CFormInput
                        placeholder="Enter address"
                        aria-describedby="basic-addon"
                        style={{
                            height: '40px',
                            fontSize: '0.9em',
                        }}
                    />
                    <CInputGroupText id="basic-addon" className="px-3">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </CInputGroupText>
                </CInputGroup>
            </CForm>
            <LoadScript googleMapsApiKey={VITE_APP_GOOGLE_MAP}>
                <GoogleMap
                    mapContainerStyle={{
                        height: '400px',
                        width: '100%',
                    }}
                    zoom={10}
                ></GoogleMap>
            </LoadScript>
        </div>
    )
}

export default Routes
