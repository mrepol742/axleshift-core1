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
                        {isAdmin() && <CTableHeaderCell>User</CTableHeaderCell>}
                        <CTableHeaderCell>Location</CTableHeaderCell>
                        <CTableHeaderCell>Device</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Last Accessed</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {result.sessions.map((session) => (
                        <CTableRow key={session.id}>
                            <CTableDataCell>{session.id}</CTableDataCell>
                            {isAdmin() && <CTableDataCell>{session.user}</CTableDataCell>}
                            <CTableDataCell>{session.location}</CTableDataCell>
                            <CTableDataCell>{session.device}</CTableDataCell>
                            <CTableDataCell>{session.status}</CTableDataCell>
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
                id: PropTypes.number.isRequired,
                user: PropTypes.string,
                location: PropTypes.string.isRequired,
                device: PropTypes.string.isRequired,
                status: PropTypes.string.isRequired,
                last_accessed: PropTypes.string.isRequired,
            }),
        ).isRequired,
    }).isRequired,
}

export default Sessions
