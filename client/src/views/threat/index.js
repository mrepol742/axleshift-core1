import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const Threat = () => {
    const [state, setState] = useState('2')
    const [priority, setPriority] = useState('1')
    const [order, setOrder] = useState('1')
    const [query, setQuery] = useState('')
    const navigate = useNavigate()

    return (
        <div>
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
            <div className="text-center border rounded">
                <div className="p-0 p-md-5 my-5 my-md-0">
                    <CImage src="/images/threat.png" fluid width="50%" />
                    <h1>We couldn&apos;t find any threats.</h1>
                    <p>Should we add one? :)</p>
                </div>
            </div>
        </div>
    )
}

export default Threat
