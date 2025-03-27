import React, { useState } from 'react'
import { CButton, CFormInput, CInputGroup, CInputGroupText, CFormCheck } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import Form from './Form'

const NewAddress = () => {
    const [formData, setFormData] = useState({})
    const navigate = useNavigate()

    return (
        <div>
            <CButton
                color="primary"
                size="sm"
                onClick={(e) => navigate('/my-addresses')}
                className="ms-auto mb-3"
            >
                <FontAwesomeIcon icon={faChevronLeft} className="me-2" /> Back
            </CButton>
            <Form data={{ formData, setFormData }} />
        </div>
    )
}

export default NewAddress
