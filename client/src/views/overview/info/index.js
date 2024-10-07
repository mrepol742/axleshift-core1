import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import {
    CCard,
    CCardGroup,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CPagination,
    CPaginationItem,
    CSpinner,
    CButton,
    CButtonGroup,
} from '@coreui/react'
import Cookies from 'js-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ShipperForm from '../../../components/freight/ShipperForm'
import ConsineeForm from '../../../components/freight/ConsineeForm'
import ShipmentForm from '../../../components/freight/ShipmentForm'
import AirForm from '../../../components/freight/shipping/AirForm'
import LandForm from '../../../components/freight/shipping/LandForm'
import SeaForm from '../../../components/freight/shipping/SeaForm'

const FreightInfo = () => {
    const dataF = {
        shipper: {
            shipper_company_name: '',
            shipper_contact_name: '',
            shipper_contact_email_address: '',
            shipper_contact_phone_number: '',
            shipper_company_address: '',
        },
        consignee: {
            consignee_company_name: '',
            consignee_contact_name: '',
            consignee_contact_email_address: '',
            consignee_contact_phone_number: '',
            consignee_company_address: '',
        },
        shipment: {
            shipment_description: '',
            shipment_weight: 0,
            shipment_dimension_length: 0,
            shipment_dimension_width: 0,
            shipment_dimension_height: 0,
            shipment_volume: 0,
            shipment_value: 0,
            shipment_instructions: '',
        },
    }
    const [formData, setFormData] = useState(dataF)
    const [editedFormData, setEditedFormData] = useState(dataF)
    const [type, setType] = useState('')
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)
    const navigate = useNavigate()
    const { id } = useParams()

    const handleInputChange = (e, section) => {
        const { id, value } = e.target
        setEditedFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [id]: value,
            },
        }))
    }

    const fetchData = async () => {
        setLoading(true)
        await axios
            .get(`${import.meta.env.VITE_APP_API_URL}/api/v1/freight/${id}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_APP_SESSION)}`,
                },
            })
            .then((response) => {
                setType(response.data.data[0].type)
                setFormData(response.data.data[0].data)
                setEditedFormData(response.data.data[0].data)
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleEditButton = async () => {
        if (isDisabled) return setIsDisabled(false)
        setLoading(true)
        await axios
            .post(
                `${import.meta.env.VITE_APP_API_URL}/api/v1/freight/u/${type}/${id}`,
                editedFormData,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_APP_SESSION)}`,
                    },
                },
            )
            .then((response) => {
                alert('save')
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setLoading(false)
                setIsDisabled(true)
            })
    }

    const handleDeleteButton = async () => {
        if (!isDisabled) {
            setIsDisabled(true)
            setEditedFormData(formData)
            return
        }
        setLoading(true)
        await axios
            .post(
                `${import.meta.env.VITE_APP_API_URL}/api/v1/freight/d/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_APP_SESSION)}`,
                    },
                },
            )
            .then((response) => {
                navigate('/')
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const renderForm = () => {
        switch (type) {
            case 'air':
                return <AirForm isInfo={true} formData={formData} isDisabled={true} />
            case 'land':
                return <LandForm isInfo={true} formData={formData} isDisabled={true} />
            case 'sea':
                return <SeaForm isInfo={true} formData={formData} isDisabled={true} />
            default:
                return null
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // i tried to resuse them like how she re--use u
    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>#{id}</span>
                <CButtonGroup>
                    <CButton color="primary" className="me-2 rounded" onClick={handleEditButton}>
                        {!isDisabled ? 'Save' : 'Edit'}
                    </CButton>
                    <CButton
                        color={!isDisabled ? 'secondary' : 'danger'}
                        className="me-2 rounded"
                        onClick={handleDeleteButton}
                    >
                        {!isDisabled ? 'Cancel' : 'Delete'}
                    </CButton>
                </CButtonGroup>
            </div>
            <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                <CCol>
                    <ShipperForm
                        isInfo={true}
                        formData={editedFormData}
                        handleInputChange={handleInputChange}
                        isDisabled={isDisabled}
                    />
                </CCol>
                <CCol>
                    <ConsineeForm
                        isInfo={true}
                        formData={editedFormData}
                        handleInputChange={handleInputChange}
                        isDisabled={isDisabled}
                    />
                </CCol>
            </CRow>
            <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                <CCol>
                    <ShipmentForm
                        isInfo={true}
                        formData={editedFormData}
                        handleInputChange={handleInputChange}
                        isDisabled={isDisabled}
                    />
                </CCol>
                <CCol>{renderForm()}</CCol>
            </CRow>
        </div>
    )
}

export default FreightInfo
