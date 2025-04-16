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
    CModal,
    CModalTitle,
    CModalHeader,
    CModalBody,
} from '@coreui/react'
import { useDropzone } from 'react-dropzone'
import jsqr from 'jsqr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCamera } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../components/AppToastProvider'

const Track = () => {
    const { addToast } = useToast()
    const [trackingNumber, setTrackingNumber] = useState('')
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const navigate = useNavigate()

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(reader.result)
                handleScan(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!trackingNumber || trackingNumber.trim().length === 0) return null
        if (/^[A-Z]{2}-\d+$/.test(trackingNumber)) return navigate(`/track/${trackingNumber}`)
        addToast('Invalid Tracking ID Number.')
    }

    const loadTrackingNumber = (_trackinNumber) => {
        setShowModal(false)
        setTrackingNumber(_trackinNumber)
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            if (!_trackinNumber || _trackinNumber.trim().length === 0) return null
            if (/^[A-Z]{2}-\d+$/.test(_trackinNumber)) return navigate(`/track/${_trackinNumber}`)
            addToast('Invalid Tracking ID Number.')
        }, 1000)
    }

    const handleCamera = () => {
        setShowModal(true)
        const video = document.createElement('video')
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: 'environment' } })
            .then((stream) => {
                video.srcObject = stream
                video.setAttribute(
                    'style',
                    'position: absolute; top: 0; left: 0; width: 100%; height: auto; z-index: 50000;',
                )
                document.getElementById('video').appendChild(video)
                video.addEventListener('loadedmetadata', () => {
                    video.play()

                    const captureFrame = () => {
                        canvas.width = video.videoWidth
                        canvas.height = video.videoHeight
                        context.drawImage(video, 0, 0, canvas.width, canvas.height)
                        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
                        const qrCode = jsqr(imageData.data, canvas.width, canvas.height)

                        if (qrCode) {
                            stream.getTracks().forEach((track) => track.stop())
                            video.remove()
                            loadTrackingNumber(qrCode.data)
                        } else {
                            requestAnimationFrame(captureFrame)
                        }
                    }

                    captureFrame()
                })
            })
            .catch((e) => {
                addToast('Unable to access camera.')
                console.error('Error accessing camera:', e)
            })
    }

    const closeModa = () => {
        setShowModal(false)
        const videoElement = document.querySelector('video')
        if (videoElement) videoElement.remove()
    }

    const handleScan = (image) => {
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
            loadTrackingNumber(trackingNumber.data)
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
                            <CFormInput {...getInputProps()} accept=".png,.jpg" />
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
                    <div className="mt-3">
                        <CButton color="primary" onClick={() => handleCamera()}>
                            <FontAwesomeIcon icon={faCamera} className="me-2" /> Open Camera
                        </CButton>
                    </div>
                </CCol>
            </CRow>
            {showModal && (
                <CModal
                    alignment="center"
                    fullscreen="sm"
                    scrollable
                    backdrop="static"
                    keyboard={false}
                    visible={showModal}
                    onClose={() => closeModa()}
                    aria-labelledby="ScheduleShipment"
                >
                    <CModalHeader>
                        <CModalTitle>QRCode Scanner</CModalTitle>
                    </CModalHeader>
                    <CModalBody className="vh-100">
                        <div id="video" className="h-50"></div>
                        Instructions:
                        <ul>
                            <li>Ensure the QR code is well-lit and clearly visible.</li>
                            <li>Hold the QR code steady in front of the camera.</li>
                            <li>
                                Position the QR code within the camera&apos;s frame for better
                                detection.
                            </li>
                            <li>Avoid reflections or glare on the QR code surface.</li>
                            <li>Keep the camera lens clean for optimal scanning.</li>
                        </ul>
                    </CModalBody>
                </CModal>
            )}
        </div>
    )
}

export default Track
