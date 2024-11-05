import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CForm, CInputGroup, CFormInput, CInputGroupText } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const AppSearch = ({ handleSearchSubmit, query, setQuery }) => {
    return (
        <CForm method="get" onSubmit={handleSearchSubmit}>
            <CInputGroup className="mb-3">
                <CFormInput
                    placeholder="Search"
                    aria-label="tracking id"
                    aria-describedby="basic-addon"
                    name="q"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <CInputGroupText id="basic-addon" type="submit">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </CInputGroupText>
            </CInputGroup>
        </CForm>
    )
}

AppSearch.propTypes = {
    handleSearchSubmit: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    setQuery: PropTypes.func.isRequired,
}

export default AppSearch
