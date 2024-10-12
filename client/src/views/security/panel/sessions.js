import React from 'react'
import PropTypes from 'prop-types'
import {
    CContainer,
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CForm,
    CFormSelect,
    CRow,
    CCol,
    CImage,
    CCard,
    CCardTitle,
    CButton,
    CCardHeader,
    CSpinner,
    CCardBody,
    CCardText,
    CCardFooter,
    CTable,
    CTableHead,
    CTableRow,
    CTableDataCell,
    CTableBody,
    CTableHeaderCell,
    CTabs,
    CTabList,
    CTab,
    CTabContent,
    CTabPanel,
} from '@coreui/react'
import { isAdmin } from '../../../components/Profile'

const Sessions = ({ result }) => {
    return (
        <>
            <CTable striped>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>#</CTableHeaderCell>
                        {isAdmin && <CTableHeaderCell>User</CTableHeaderCell>}
                        <CTableHeaderCell>Location</CTableHeaderCell>
                        <CTableHeaderCell>Device</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Last Accessed</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {result.sessions.map((session, index) => (
                        <CTableRow key={index}>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            {isAdmin && <CTableDataCell>{session.user_id}</CTableDataCell>}
                            <CTableDataCell>{session.ip_address}</CTableDataCell>
                            <CTableDataCell>{session.user_agent}</CTableDataCell>
                            <CTableDataCell>{session.active}</CTableDataCell>
                            <CTableDataCell>{session.last_accessed}</CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </>
    )
}

Sessions.propTypes = {
    result: PropTypes.shape({
        sessions: PropTypes.arrayOf(
            PropTypes.shape({
                _id: PropTypes.string.isRequired,
                user_id: PropTypes.string,
                ip_address: PropTypes.string.isRequired,
                user_agent: PropTypes.string.isRequired,
                active: PropTypes.string.isRequired,
                last_accessed: PropTypes.string.isRequired,
            }),
        ).isRequired,
    }).isRequired,
}

export default Sessions
