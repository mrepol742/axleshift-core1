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
    const [formData, setFormData] = useState({
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
    })
    const [type, setType] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { id } = useParams()

    const handleTypeChange = (newType) => {
        setType(newType)

        const updatedShippingData = {
            ...(newType === 'air'
                ? {
                      shipping_origin_airport: '',
                      shipping_destination_airport: '',
                      shipping_preferred_departure_date: '',
                      shipping_preferred_arrival_date: '',
                      shipping_flight_type: '1',
                  }
                : newType === 'land'
                  ? {
                        shipping_origin_addresss: '',
                        shipping_destination_address: '',
                        shipping_pickup_date: '',
                        shipping_delivery_date: '',
                        shipping_vehicle_type: 0,
                    }
                  : newType === 'sea'
                    ? {
                          shipping_loading_port: '',
                          shipping_discharge_port: '',
                          shipping_sailing_date: '',
                          shipping_estimated_arrival_date: '',
                          shipping_cargo_type: '',
                      }
                    : {}),
        }

        setFormData((prevData) => ({
            ...prevData,
            shipping: updatedShippingData,
        }))
    }

    const handleInputChange = (e, section) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [id]: value,
            },
        }))
    }

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `${import.meta.env.VITE_APP_API_URL}/api/v1/freight/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_APP_SESSION)}`,
                    },
                },
            )

            if (response.status !== 200) return setError(true)
            handleTypeChange(response.data.data[0].type)
            setFormData(response.data.data[0].data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const renderForm = () => {
        switch (type) {
            case 'air':
                return (
                    <AirForm
                        isInfo={true}
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                )
            case 'land':
                return (
                    <LandForm
                        isInfo={true}
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                )
            case 'sea':
                return (
                    <SeaForm
                        isInfo={true}
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                )
            default:
                return null
        }
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

            <h3>#{id}</h3>
            <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                <CCol>
                    <ShipperForm
                        isInfo={true}
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                </CCol>
                <CCol>
                    <ConsineeForm
                        isInfo={true}
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                </CCol>
            </CRow>
            <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                <CCol>
                    <ShipmentForm
                        isInfo={true}
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                </CCol>
                <CCol>{renderForm()}</CCol>
            </CRow>
        </div>
    )
}

export default FreightInfo
