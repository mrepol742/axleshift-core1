import React from 'react'
import { CForm, CButton, CFormInput, CInputGroup, CInputGroupText, CFormCheck } from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { VITE_APP_RECAPTCHA_SITE_KEY } from '../../config.js'

const FormAddress = ({ data }) => {
    const { formData, setFormData } = data
    const recaptchaRef = React.useRef()
    const navigate = useNavigate()

    const handleChange = (section, e) => {
        const { name, value } = e.target
        alert(name)
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value,
            },
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const recaptcha = await recaptchaRef.current.executeAsync()
        const action = formData._id ? 'update' : ''
    }

    return (
        <CForm handleSubmit={handleSubmit}>
            <div className="d-block d-lg-flex gap-5">
                <div>
                    <h4>From</h4>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>Name</CInputGroupText>
                        <CFormInput
                            type="text"
                            placeholder="First & last name"
                            name="name"
                            value={formData.from?.name}
                            onChange={(e) => handleChange('from', e)}
                            required
                        />
                    </CInputGroup>
                    <CInputGroup className="mb-1">
                        <CInputGroupText>Company</CInputGroupText>
                        <CFormInput
                            type="text"
                            name="company"
                            value={formData.from?.company}
                            onChange={(e) => handleChange('from', e)}
                            required
                        />
                    </CInputGroup>
                    <CFormCheck
                        className="mb-3"
                        name="business_contract"
                        label="Business Contract"
                        checked={formData.from?.business_contract}
                        onChange={(e) => handleChange('from', e)}
                        required
                    />
                    <CInputGroup className="mb-3">
                        <CInputGroupText>Country</CInputGroupText>
                        <CFormInput
                            type="text"
                            name="country"
                            value={formData.from?.country}
                            onChange={(e) => handleChange('from', e)}
                            required
                        />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>Address</CInputGroupText>
                        <CFormInput
                            type="text"
                            name="address"
                            value={formData.from?.address}
                            onChange={(e) => handleChange('from', e)}
                            required
                        />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>Address 2</CInputGroupText>
                        <CFormInput
                            type="text"
                            name="address2"
                            value={formData.from?.address2}
                            onChange={(e) => handleChange('from', e)}
                        />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>Address 3</CInputGroupText>
                        <CFormInput
                            type="text"
                            name="address3"
                            value={formData.from?.address3}
                            onChange={(e) => handleChange('from', e)}
                        />
                    </CInputGroup>
                    <div className="d-block d-sm-flex">
                        <CInputGroup className="mb-3 me-3">
                            <CInputGroupText>Postal Code</CInputGroupText>
                            <CFormInput
                                type="text"
                                name="postal_code"
                                value={formData.from?.postal_code}
                                onChange={(e) => handleChange('from', e)}
                                required
                            />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                            <CInputGroupText>City</CInputGroupText>
                            <CFormInput
                                type="text"
                                name="city"
                                value={formData.from?.city}
                                onChange={(e) => handleChange('from', e)}
                                required
                            />
                        </CInputGroup>
                    </div>
                    <div className="d-block d-sm-flex">
                        <CInputGroup className="mb-3 me-3">
                            <CInputGroupText>Email</CInputGroupText>
                            <CFormInput
                                type="email"
                                name="email"
                                value={formData.from?.email}
                                onChange={(e) => handleChange('from', e)}
                                required
                            />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                            <CInputGroupText>Phone number</CInputGroupText>
                            <CFormInput
                                type="number"
                                name="phone_number"
                                value={formData.from?.phone_number}
                                onChange={(e) => handleChange('from', e)}
                                required
                            />
                        </CInputGroup>
                    </div>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>VAT/TAX ID</CInputGroupText>
                        <CFormInput
                            type="text"
                            name="vat_tax_id"
                            value={formData.from?.vat_tax_id}
                            onChange={(e) => handleChange('from', e)}
                        />
                    </CInputGroup>
                </div>
                <div>
                    <h4>To</h4>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>Name</CInputGroupText>
                        <CFormInput
                            type="text"
                            placeholder="First & last name"
                            name="name"
                            value={formData.to?.name}
                            onChange={(e) => handleChange('to', e)}
                            required
                        />
                    </CInputGroup>
                    <CInputGroup className="mb-1">
                        <CInputGroupText>Company</CInputGroupText>
                        <CFormInput
                            type="text"
                            name="company"
                            value={formData.to?.company}
                            onChange={(e) => handleChange('to', e)}
                            required
                        />
                    </CInputGroup>
                    <CFormCheck
                        className="mb-3"
                        name="business_contract"
                        label="Business Contract"
                        checked={formData.to?.business_contract}
                        onChange={(e) => handleChange('to', e)}
                    />
                    <CInputGroup className="mb-3">
                        <CInputGroupText>Country</CInputGroupText>
                        <CFormInput
                            type="text"
                            name="country"
                            value={formData.to?.country}
                            onChange={(e) => handleChange('to', e)}
                            required
                        />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>Address</CInputGroupText>
                        <CFormInput
                            type="text"
                            name="address"
                            value={formData.to?.address}
                            onChange={(e) => handleChange('to', e)}
                            required
                        />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>Address 2</CInputGroupText>
                        <CFormInput
                            type="text"
                            name="address2"
                            value={formData.to?.address2}
                            onChange={(e) => handleChange('to', e)}
                        />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>Address 3</CInputGroupText>
                        <CFormInput
                            type="text"
                            name="address3"
                            value={formData.to?.address3}
                            onChange={(e) => handleChange('to', e)}
                        />
                    </CInputGroup>
                    <div className="d-block d-sm-flex">
                        <CInputGroup className="mb-3 me-3">
                            <CInputGroupText>Postal Code</CInputGroupText>
                            <CFormInput
                                type="text"
                                name="postal_code"
                                value={formData.to?.postal_code}
                                onChange={(e) => handleChange('to', e)}
                                required
                            />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                            <CInputGroupText>City</CInputGroupText>
                            <CFormInput
                                type="text"
                                name="city"
                                value={formData.to?.city}
                                onChange={(e) => handleChange('to', e)}
                                required
                            />
                        </CInputGroup>
                    </div>
                    <div className="d-block d-sm-flex">
                        <CInputGroup className="mb-3 me-3">
                            <CInputGroupText>Email</CInputGroupText>
                            <CFormInput
                                type="text"
                                name="email"
                                value={formData.to?.email}
                                onChange={(e) => handleChange('to', e)}
                                required
                            />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                            <CInputGroupText>Phone number</CInputGroupText>
                            <CFormInput
                                type="number"
                                name="phone_number"
                                value={formData.to?.phone_number}
                                onChange={(e) => handleChange('to', e)}
                                required
                            />
                        </CInputGroup>
                    </div>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>Type of ID</CInputGroupText>
                        <CFormInput
                            type="text"
                            name="id_type"
                            value={formData.to?.id_type}
                            onChange={(e) => handleChange('to', e)}
                            required
                        />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>ID Number</CInputGroupText>
                        <CFormInput
                            type="number"
                            name="phone_number"
                            value={formData.to?.phone_number}
                            onChange={(e) => handleChange('to', e)}
                            required
                        />
                    </CInputGroup>
                </div>
            </div>
            <div className="d-flex mt-4 mb-3">
                <CButton type="submit" color="primary" className="me-2 rounded">
                    Save
                </CButton>
                <CButton
                    type="button"
                    color="outline-secondary"
                    className="rounded"
                    onClick={(e) => navigate('/my-addresses')}
                >
                    Cancel
                </CButton>
            </div>
            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_APP_RECAPTCHA_SITE_KEY} />
        </CForm>
    )
}

export default FormAddress

FormAddress.propTypes = {
    data: PropTypes.object.isRequired,
}
