import React from 'react'
import PropTypes from 'prop-types'
import { CForm, CInputGroup, CFormInput, CInputGroupText } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const Search = () => {
    return (
        <CForm method="get">
            <CInputGroup className="mb-3">
                <CFormInput
                    placeholder="Search"
                    aria-label="tracking id"
                    aria-describedby="basic-addon"
                    name="q"
                />
                <CInputGroupText id="basic-addon" type="submit">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </CInputGroupText>
            </CInputGroup>
        </CForm>
    )
}

export default Search
