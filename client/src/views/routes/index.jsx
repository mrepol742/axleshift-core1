import React, { useState, useRef, useEffect } from 'react'
import { CButton, CFormInput, CSpinner } from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import {
    GoogleMap,
    LoadScript,
    Autocomplete,
    Marker,
    DirectionsRenderer,
} from '@react-google-maps/api'
import { useToast } from '../../components/AppToastProvider'

import { VITE_APP_GOOGLE_MAP, VITE_APP_RECAPTCHA_SITE_KEY } from '../../config'

/*
 * DATA FLOW
 * INPUT ---> PICKUP ADDRESSS
 * CONFIRMATION ->
 * INPUT ---> DROPOFF ADDRESSS
 * CONFIRMATION ->
 * CALL BACKEND API ->
 * RENDER DIRECTIONS -->
 * MAP
 */
const MyMapComponent = () => {
    const { addToast } = useToast()
    const recaptchaRef = React.useRef()
    const [loading, setLoading] = useState(false)

    const [address, setAddress] = useState('')
    const [directions, setDirections] = useState(null)

    const [pickup, setPickup] = useState(null)
    const [dropoff, setDropoff] = useState(null)

    const [currentLocation, setCurrentLocation] = useState(null)

    const autocompleteRef = useRef(null)
    const mapContainerStyle = {
        height: '400px',
        width: '100%',
    }
    const libraries = ['places']

    const handlePickupAddress = (e) => {
        e.preventDefault()
        setPickup(currentLocation)
        setCurrentLocation(null)
        setAddress('')
    }

    const handleDropoffAddress = (e) => {
        e.preventDefault()
        const _dropoff = currentLocation
        setDropoff(_dropoff)
        setCurrentLocation(null)
        setAddress('')

        // const recaptcha = await recaptchaRef.current.executeAsync()
        // setLoading(true)

        if (!pickup) return addToast('Invalid pickup')

        axios
            .post(`/freight/optimized-route`, {
                pickup: pickup,
                dropoff: _dropoff,
            })
            .then((response) => setDirections(response.data))
            .catch((error) => {
                const message =
                    error.response?.data?.error || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    const onLoadAutocomplete = (autocomplete) => {
        autocompleteRef.current = autocomplete
    }

    const handlePlaceChange = (state) => {
        const place = autocompleteRef.current.getPlace()
        if (place.geometry) {
            const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            }
            setCurrentLocation(location)
            setAddress(place.formatted_address)
        }
    }

    // useEffect(() => {
    //     axios
    //         .post(`/freight/optimized-route`, {
    //             pickup: { lat: 40.712776, lng: -74.005974 },
    //             dropoff: { lat: 34.052235, lng: -118.243683 },
    //         })
    //         .then((response) => setDirections(response.data))
    //         .catch((error) => {
    //             const message =
    //                 error.response?.data?.error || 'Server is offline or restarting please wait'
    //             addToast(message)
    //         })
    //         .finally(() => setLoading(false))
    // }, [])

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}

            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_APP_RECAPTCHA_SITE_KEY} />

            {JSON.stringify(directions)}

            <h4>{!pickup ? 'Enter pickup address' : 'Enter dropoff address'}</h4>
            <LoadScript googleMapsApiKey={VITE_APP_GOOGLE_MAP} libraries={libraries}>
                <div className="mb-3">
                    <Autocomplete
                        onLoad={onLoadAutocomplete}
                        onPlaceChanged={handlePlaceChange}
                        options={{ types: ['address'] }}
                        className="mb-3"
                    >
                        <CFormInput
                            type="text"
                            placeholder="..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </Autocomplete>

                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={directions || currentLocation ? 18 : 2}
                        center={currentLocation || { lat: 0, lng: 0 }}
                    >
                        {currentLocation && <Marker position={currentLocation} />}
                        {pickup && dropoff && (
                            <>
                                {!directions && <Marker position={pickup} />}
                                {!directions && <Marker position={dropoff} />}
                                {directions && <DirectionsRenderer directions={directions} />}
                            </>
                        )}
                    </GoogleMap>
                </div>
                <CButton
                    color="primary"
                    onClick={pickup ? handleDropoffAddress : handlePickupAddress}
                    disabled={currentLocation ? false : true}
                >
                    {pickup ? 'Confirm dropoff' : 'Confirm Pickup Address'}
                </CButton>
            </LoadScript>
        </div>
    )
}

export default MyMapComponent
