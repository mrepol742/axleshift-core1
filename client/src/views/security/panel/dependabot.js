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

const Dependabot = ({
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
            {result.scm.length === 0 && (
                <div className="text-center border rounded">
                    <div className="p-0 p-md-5 my-5 my-md-0">
                        <CImage src="/images/threat.png" fluid width="50%" />
                        <h1>We couldn&apos;t find any threats.</h1>
                        <p>Should we add one? :)</p>
                    </div>
                </div>
            )}
            {result.scm.length !== 0 && (
                <>
                    <CInputGroup>
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
                    <CForm className="d-flex justify-content-left my-2 my-lg-0 overflow-scroll no-scrollbar">
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
                        <div className="mx-2"></div>
                    </CForm>

                    <CTable striped>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>#</CTableHeaderCell>
                                <CTableHeaderCell>State</CTableHeaderCell>
                                <CTableHeaderCell>Scope</CTableHeaderCell>
                                <CTableHeaderCell>Manifest</CTableHeaderCell>
                                <CTableHeaderCell>CVE</CTableHeaderCell>
                                <CTableHeaderCell>Summary</CTableHeaderCell>
                                <CTableHeaderCell>Severity</CTableHeaderCell>
                                <CTableHeaderCell>Updated At</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {result.scm.map((alert) => (
                                <CTableRow key={alert.number}>
                                    <CTableDataCell>{alert.number}</CTableDataCell>
                                    <CTableDataCell>{alert.state}</CTableDataCell>
                                    <CTableDataCell>{alert.scope}</CTableDataCell>
                                    <CTableDataCell>{alert.manifest}</CTableDataCell>
                                    <CTableDataCell>{alert.cve}</CTableDataCell>
                                    <CTableDataCell>{alert.summary}</CTableDataCell>
                                    <CTableDataCell>{alert.severity}</CTableDataCell>
                                    <CTableDataCell>
                                        {parseTimestamp(new Date(alert.updated_at).getTime())}
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

Dependabot.propTypes = {
    query: PropTypes.string.isRequired,
    setQuery: PropTypes.func.isRequired,
    state: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    priority: PropTypes.string.isRequired,
    setPriority: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    setOrder: PropTypes.func.isRequired,
    result: PropTypes.shape({
        scm: PropTypes.arrayOf(
            PropTypes.shape({
                number: PropTypes.number.isRequired,
                state: PropTypes.string.isRequired,
                scope: PropTypes.string.isRequired,
                manifest: PropTypes.string.isRequired,
                cve: PropTypes.string.isRequired,
                summary: PropTypes.string.isRequired,
                severity: PropTypes.string.isRequired,
                created_at: PropTypes.string.isRequired,
                updated_at: PropTypes.string.isRequired,
            }),
        ).isRequired,
    }).isRequired,
}

export default Dependabot
