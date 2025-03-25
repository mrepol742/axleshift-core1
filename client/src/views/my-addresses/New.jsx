import React from 'react'
import { CButton, CFormInput, CInputGroup, CInputGroupText, CFormCheck } from '@coreui/react'
import Form from './Form'

const NewAddress = () => {
    const [formData, setFormData] = React.useState({})

    return (
        <div>
            <h3>New Address</h3>
            <Form data={{ formData, setFormData }} />
        </div>
    )
}

export default NewAddress
