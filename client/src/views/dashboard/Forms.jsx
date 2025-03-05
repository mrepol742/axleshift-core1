import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CForm,
    CRow,
    CCol,
    CFormSwitch,
    CFormCheck,
    CFormSelect,
    CTabs,
    CTabList,
    CTab,
    CTabContent,
    CTabPanel,
    CButton,
    CFormInput,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

const Forms = ({ data }) => {
    return <div id="forms">this is a test</div>
}

export default Forms

Forms.propTypes = {
    data: PropTypes.object.isRequired,
}
