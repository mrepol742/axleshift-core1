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
    CFormSelect,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
} from '@coreui/react'
import Cookies from 'js-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Pricing = () => {
    const [selectedOption, setSelectedOption] = useState('')
    const [type, setType] = useState('0')
    const data = {
        air: [
            { label: 'Cargo-Only Flights', value: '1' },
            { label: 'Passenger Flights with Cargo Holds', value: '2' },
            { label: 'Charter Flights', value: '3' },
            { label: 'Express Service', value: '4' },
        ],
        land: [
            { label: 'Truck', value: '1' },
            { label: 'Van', value: '2' },
            { label: 'Trailers', value: '3' },
            { label: 'Buses', value: '4' },
            { label: 'Motorcycles', value: '5' },
        ],
        sea: [
            { label: 'Containerized Cargo', value: '1' },
            { label: 'Bulk Cargo', value: '2' },
            { label: 'Breakbulk Cargo', value: '3' },
            { label: 'Reefer Cargo', value: '4' },
            { label: 'RORO Cargo', value: '5' },
            { label: 'Heavy Lift Cargo', value: '6' },
        ],
    }

    const getOptions = () => {
        if (selectedOption && data[selectedOption]) {
            return [{ label: 'Select an option', value: '' }, ...data[selectedOption]]
        }
        return []
    }

    return (
        <>
            <CRow xs={{ cols: 1 }} sm={{ cols: 2 }}>
                <CCol>
                    <CFormSelect
                        options={[
                            { label: 'Select an option', value: '' },
                            { label: 'Air Freight', value: 'air' },
                            { label: 'Land Freight', value: 'land' },
                            { label: 'Sea Freight', value: 'sea' },
                        ]}
                        required
                        className="mb-3"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                    />

                    {selectedOption !== '' && (
                        <CFormSelect
                            options={getOptions()}
                            value={type}
                            required
                            className="mb-3"
                            onChange={(e) => setType(e.target.value)}
                        />
                    )}
                </CCol>
                <CCol>
                    {type != '0' && (
                        <CTable striped hover className="border">
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">KM</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Weight</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                <CTableRow>
                                    <CTableHeaderCell scope="row">1</CTableHeaderCell>
                                    <CTableDataCell>1,000</CTableDataCell>
                                    <CTableDataCell>2KG</CTableDataCell>
                                    <CTableDataCell>1,000P</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableHeaderCell scope="row">2</CTableHeaderCell>
                                    <CTableDataCell>3,000</CTableDataCell>
                                    <CTableDataCell>7KG</CTableDataCell>
                                    <CTableDataCell>1,600P</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableHeaderCell scope="row">3</CTableHeaderCell>
                                    <CTableDataCell>9,000</CTableDataCell>
                                    <CTableDataCell>10KG</CTableDataCell>
                                    <CTableDataCell>1,900P</CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    )}
                </CCol>
            </CRow>
        </>
    )
}

export default Pricing
