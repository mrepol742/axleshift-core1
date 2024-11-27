import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CForm,
    CFormSelect,
    CRow,
    CCol,
    CCard,
    CCardTitle,
    CSpinner,
    CCardBody,
    CTable,
    CTableHead,
    CTableRow,
    CTableDataCell,
    CTableBody,
    CTableHeaderCell,
} from '@coreui/react'

const Panel = ({ result, type }) => {
    return (
        <CCard>
            <CCardBody>
                <CCardTitle>Rates</CCardTitle>
                <CTable hover responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                Distance (km)
                            </CTableHeaderCell>
                            <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                Weight (kg)
                            </CTableHeaderCell>
                            <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                Courier
                            </CTableHeaderCell>
                            <CTableHeaderCell className="text-muted poppins-regular table-header-cell-no-wrap">
                                Cost
                            </CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {result
                            .filter((rate) => rate.type === type)
                            .map((rate, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>{rate.distance}</CTableDataCell>
                                    <CTableDataCell>{rate.weight}</CTableDataCell>
                                    <CTableDataCell>{rate.courier}</CTableDataCell>
                                    <CTableDataCell>{rate.cost}</CTableDataCell>
                                </CTableRow>
                            ))}
                    </CTableBody>
                </CTable>
            </CCardBody>
        </CCard>
    )
}

Panel.propTypes = {
    result: PropTypes.any.isRequired,
    type: PropTypes.oneOf(['air', 'land', 'sea']).isRequired,
}

export default Panel
