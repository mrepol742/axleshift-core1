import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
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
import { useDropzone } from 'react-dropzone'
import jsqr from 'jsqr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../components/AppToastProvider'

const Track = () => {
    const { addToast } = useToast()
    const [trackingNumber, setTrackingNumber] = useState('')
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
            handleScan()
        }
    }

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!trackingNumber || trackingNumber.trim().length === 0) return null
        if (/^[A-Z]{2}-\d+$/.test(trackingNumber)) return navigate(`/track/${trackingNumber}`)
        addToast('Invalid Tracking ID Number.')
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
            const trackingNumber = jsqr(imageData.data, canvas.width, canvas.height)

            if (!trackingNumber) return addToast('No QR code found.')

            const _trackinNumber = trackingNumber.data
            setTrackingNumber(_trackinNumber)
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
                if (!_trackinNumber || _trackinNumber.trim().length === 0) return null
                if (/^[A-Z]{2}-\d+$/.test(_trackinNumber))
                    return navigate(`/track/${_trackinNumber}`)
                addToast('Invalid Tracking ID Number.')
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

            <CRow className="mb-3">
                <CCol xs={4} className="image-container d-none d-md-flex">
                    <CImage
                        fluid
                        rounded
                        src="/images/freight-track.jpg"
                        className="custom-image"
                        loading="lazy"
                    />
                </CCol>
                <CCol md={7} className="mb-4">
                    <h1>Tracking Number</h1>
                    <CForm className="mb-3" onSubmit={handleSubmit}>
                        <CInputGroup>
                            <CFormInput
                                aria-label="Track shipment"
                                aria-describedby="basic-addon"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="AX-17XXXXXXXXXX"
                            />
                            <CInputGroupText id="basic-addon" onClick={handleSubmit}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </CInputGroupText>
                        </CInputGroup>
                    </CForm>
                    <div>
                        <CCard
                            className="d-inline-block text-center border border-2"
                            {...getRootProps()}
                        >
                            <CFormInput {...getInputProps()} />
                            {!image && (
                                <div className="p-5">
                                    <CCardTitle>Drag & Drop QRCode</CCardTitle>
                                    <p>or click to select an image</p>
                                </div>
                            )}

                            {image && (
                                <CImage
                                    src={image}
                                    alt="QRCode"
                                    className="img-fluid"
                                    loading="lazy"
                                />
                            )}
                        </CCard>
                    </div>
                </CCol>
            </CRow>
        </div>
    )
}

export default Track
