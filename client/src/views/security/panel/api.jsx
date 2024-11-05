import React, { useState } from 'react'
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
import { VITE_APP_API_URL, VITE_APP_SESSION } from '../../../config'

const API = ({ setLoading, result }) => {
    const [apiToken, setApiToken] = useState('')

    const gen = async () => {
        setLoading(true)
        await axios
            .post(
                `${VITE_APP_API_URL}/api/v1/auth/token/new/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${cookies.get(VITE_APP_SESSION)}`,
                    },
                },
            )
            .then((response) => {
                alert(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => setLoading(false))
    }

    return (
        <>
            {!result.apiToken && (
                <div className="text-center border rounded">
                    <div className="p-0 p-md-5 my-5 my-md-0">
                        <CImage src="/images/threat.png" fluid width="50%" />
                        <h1>There was no API Token</h1>
                        <p>Should we add one? :)</p>
                    </div>
                </div>
            )}
            {result.apiToken && (
                <>
                    <div className="text-center border rounded">
                        <div className="p-0 p-md-5 my-5 my-md-0">
                            <CInputGroup className="mb-3">
                                <CFormInput
                                    aria-label="tracking id"
                                    aria-describedby="basic-addon"
                                    width="10px"
                                />
                                <CInputGroupText id="basic-addon">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </CInputGroupText>
                            </CInputGroup>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

API.propTypes = {
    setLoading: PropTypes.func.isRequired,
    result: PropTypes.shape({
        apiToken: PropTypes.arrayOf(PropTypes.any).isRequired,
    }).isRequired,
}

export default API
