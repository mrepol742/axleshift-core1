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
import UAParser from 'ua-parser-js'
import { isAdmin } from '../../../components/Profile'
import { parseTimestamp } from '../../../components/Timestamp'

const Sessions = ({ result }) => {
    const getDevice = (userAgent) => {
        const parser = new UAParser()
        parser.setUA(userAgent)
        const result = parser.getResult()
        return userAgent
    }

    return (
        <>
            <CTable hover responsive className="rounded">
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
                            <CTableDataCell>{getDevice(session.user_agent)}</CTableDataCell>
                            <CTableDataCell>
                                {session.active ? 'Active' : 'Inactive'}
                            </CTableDataCell>
                            <CTableDataCell>{parseTimestamp(session.last_accessed)}</CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </>
    )
}

Sessions.propTypes = {
    result: PropTypes.shape({
        browser: PropTypes.string,
        os: PropTypes.string,
        sessions: PropTypes.arrayOf(
            PropTypes.shape({
                _id: PropTypes.string.isRequired,
                user_id: PropTypes.string,
                ip_address: PropTypes.string.isRequired,
                user_agent: PropTypes.string.isRequired,
                active: PropTypes.bool.isRequired,
                last_accessed: PropTypes.number.isRequired,
            }),
        ).isRequired,
    }).isRequired,
}

export default Sessions
