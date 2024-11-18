import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CContainer,
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CForm,
    CRow,
    CCol,
    CImage,
    CCard,
    CCardTitle,
    CButton,
    CSpinner,
} from '@coreui/react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { useDropzone } from 'react-dropzone'
import jsqr from 'jsqr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const Track = () => {
    const [trackingID, setTrackingID] = useState('')
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' })

    const handleSubmit = () => {
        navigate(`/track/${trackingID}`)
    }

    const handleScan = () => {
        if (!image) return

        const imgElement = document.createElement('img')
        imgElement.src = image

        imgElement.onload = () => {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            canvas.width = imgElement.width
            canvas.height = imgElement.height
            context.drawImage(imgElement, 0, 0)

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            const trackingID = jsqr(imageData.data, canvas.width, canvas.height)

            if (!trackingID) return alert('No QR code found.')

            setTrackingID(trackingID.data)
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
                navigate(`/track/${trackingID.data}`)
            }, 2000)
        }
    }

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}

            <CRow>
                <CCol xs={3} className="image-container d-none d-md-flex">
                    <CImage
                        fluid
                        rounded
                        src="/images/freight-track.jpg"
                        className="custom-image"
                    />
                </CCol>
                <CCol md={7} className="mb-4">
                    <h1>Enter Tracking ID</h1>
                    <CForm className="mb-3" onSubmit={handleSubmit}>
                        <CInputGroup>
                            <CFormInput
                                aria-label="tracking id"
                                aria-describedby="basic-addon"
                                value={trackingID}
                                onChange={(e) => setTrackingID(e.target.value)}
                            />
                            <CInputGroupText id="basic-addon">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </CInputGroupText>
                        </CInputGroup>
                    </CForm>
                    <div>
                        <CCard
                            className="d-inline-block p-5 text-center border border-2"
                            {...getRootProps()}
                        >
                            <CFormInput {...getInputProps()} />
                            {!image && (
                                <>
                                    <CCardTitle>Drag & Drop QRCode</CCardTitle>
                                    <p>or click to select an image</p>
                                </>
                            )}

                            {image && (
                                <CImage
                                    src={image}
                                    alt="QRCode"
                                    style={{
                                        width: '128px',
                                        maxHeight: '128px',
                                        objectFit: 'cover',
                                    }}
                                />
                            )}
                        </CCard>
                        <CButton color="primary" className="d-block my-2 px-5" onClick={handleScan}>
                            Scan
                        </CButton>
                    </div>
                </CCol>
            </CRow>
        </div>
    )
}

export default Track
