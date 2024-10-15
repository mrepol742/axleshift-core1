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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import { parseTimestamp } from '../../../components/Timestamp'

const Sentry = ({
    query,
    setQuery,
    state,
    setState,
    priority,
    setPriority,
    order,
    setOrder,
    result,
}) => {
    return (
        <>
            {result.sentry.length === 0 && (
                <div className="text-center border rounded">
                    <div className="p-0 p-md-5 my-5 my-md-0">
                        <CImage src="/images/threat.png" fluid width="50%" />
                        <h1>We couldn&apos;t find any issues.</h1>
                        <p>Should we add one? :)</p>
                    </div>
                </div>
            )}
            {result.sentry.length !== 0 && (
                <>
                    <CForm className="d-flex justify-content-left my-2 my-lg-0">
                        <CInputGroup className="mb-3">
                            <CFormInput
                                aria-label="tracking id"
                                aria-describedby="basic-addon"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <CInputGroupText id="basic-addon">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </CInputGroupText>
                        </CInputGroup>
                        <div className="mx-2"></div>
                        <CFormSelect
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            options={[
                                { label: 'All', value: '0' },
                                { label: 'Resolved', value: '1' },
                                { label: 'Unresolved', value: '2' },
                                { label: 'Not Plan', value: '3' },
                            ]}
                            required
                            className="mb-3"
                        />
                        <div className="mx-2"></div>
                        <CFormSelect
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            options={[
                                { label: 'All', value: '0' },
                                { label: 'High', value: '1' },
                                { label: 'Medium', value: '2' },
                                { label: 'Low', value: '3' },
                            ]}
                            required
                            className="mb-3"
                        />
                        <div className="mx-2"></div>
                        <CFormSelect
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            options={[
                                { label: 'Newer', value: '1' },
                                { label: 'Older', value: '2' },
                            ]}
                            required
                            className="mb-3"
                        />
                    </CForm>

                    <CTable hover responsive className="rounded">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>#</CTableHeaderCell>
                                <CTableHeaderCell>Title</CTableHeaderCell>
                                <CTableHeaderCell>Culprit</CTableHeaderCell>
                                <CTableHeaderCell>Level</CTableHeaderCell>
                                <CTableHeaderCell>Status</CTableHeaderCell>
                                <CTableHeaderCell>Priority</CTableHeaderCell>
                                <CTableHeaderCell>Count</CTableHeaderCell>
                                <CTableHeaderCell>Last Updated</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {result.sentry.map((issue) => (
                                <CTableRow key={issue.id}>
                                    <CTableDataCell>{issue.id}</CTableDataCell>
                                    <CTableDataCell>{issue.title}</CTableDataCell>
                                    <CTableDataCell>{issue.culprit}</CTableDataCell>
                                    <CTableDataCell>{issue.level}</CTableDataCell>
                                    <CTableDataCell>{issue.status}</CTableDataCell>
                                    <CTableDataCell>{issue.priority}</CTableDataCell>
                                    <CTableDataCell>{issue.count}</CTableDataCell>
                                    <CTableDataCell>
                                        {parseTimestamp(new Date(issue.updated_at).getTime())}
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </>
            )}
        </>
    )
}

Sentry.propTypes = {
    query: PropTypes.string.isRequired,
    setQuery: PropTypes.func.isRequired,
    state: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    priority: PropTypes.string.isRequired,
    setPriority: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    setOrder: PropTypes.func.isRequired,
    result: PropTypes.shape({
        sentry: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                culprit: PropTypes.string.isRequired,
                level: PropTypes.string.isRequired,
                status: PropTypes.string.isRequired,
                priority: PropTypes.string.isRequired,
                count: PropTypes.string.isRequired,
                updated_at: PropTypes.string.isRequired,
            }),
        ).isRequired,
    }).isRequired,
}

export default Sentry
