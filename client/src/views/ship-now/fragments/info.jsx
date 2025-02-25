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
import { faPlaneDeparture, faTruck, faShip } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import Shipment from './shipment'

const Form = ({ form, setForm, type }) => {
    const formRef = React.useRef(null)
    const [shipment, setShipment] = useState(false)

    const handleSwitchChange = (e) => {
        setForm({ ...form, isImport: e.target.checked })
    }

    const handleInputChange = (e, field) => {
        setForm({ ...form, [field]: e.target.value })
    }

    const renderLocationFields = (prefix) => (
        <>
            <CRow xs={{ gutter: 2 }}>
                <CCol md>
                    <CFormSelect
                        floatingLabel="Country"
                        value={form[`${prefix}Country`]}
                        onChange={(e) => handleInputChange(e, `${prefix}Country`)}
                        required
                    >
                        <option value="1">Philippines</option>
                        <option value="2">The Philippines</option>
                        <option value="3">The da Philippines</option>
                    </CFormSelect>
                </CCol>
                <CCol md>
                    <CFormInput
                        type="text"
                        floatingLabel={type === 'business' ? 'City' : 'City (Optional)'}
                        className="mb-2"
                        value={form[`${prefix}City`]}
                        onChange={(e) => handleInputChange(e, `${prefix}City`)}
                        required={type === 'business'}
                    />
                    <CFormInput
                        type="number"
                        floatingLabel={type === 'business' ? 'Zip Code' : 'Zip Code (Optional)'}
                        value={form[`${prefix}ZipCode`]}
                        onChange={(e) => handleInputChange(e, `${prefix}ZipCode`)}
                        required={type === 'business'}
                    />
                </CCol>
            </CRow>
            {prefix === 'to' && (
                <CFormCheck
                    label="Residential Address"
                    checked={form.isResidentialAddress}
                    onChange={(e) => setForm({ ...form, isResidentialAddress: e.target.checked })}
                />
            )}
        </>
    )

    return (
        <CForm ref={formRef}>
            <div className="d-flex justify-content-end">
                <CFormSwitch
                    label="Import Statement"
                    checked={form.isImport}
                    onChange={handleSwitchChange}
                />
            </div>
            {form.isImport ? (
                <>
                    <span className="fw-bold">To</span>
                    {renderLocationFields('to')}
                    <span className="fw-bold">From</span>
                    {renderLocationFields('from')}
                </>
            ) : (
                <>
                    <span className="fw-bold">From</span>
                    {renderLocationFields('from')}
                    <span className="fw-bold">To</span>
                    {renderLocationFields('to')}
                </>
            )}

            {!shipment && (
                <div className="d-flex justify-content-center mb-4">
                    <CButton
                        className="btn btn-primary px-5"
                        onClick={() => {
                            if (formRef.current.checkValidity()) {
                                setShipment(true)
                                setTimeout(() => {
                                    const element = document.getElementById('shipment')
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' })
                                    }
                                }, 0)
                            } else {
                                formRef.current.reportValidity()
                            }
                        }}
                    >
                        Continue
                    </CButton>
                </div>
            )}

            {shipment && <Shipment form={form} setForm={setForm} />}
        </CForm>
    )
}

const ShippingAs = ({ form, setForm }) => {
    return (
        <>
            <h3 className="text-primary">Ship Now</h3>
            <p>You are a</p>
            <CTabs activeItemKey={1} className="mb-2">
                <CTabList variant="underline-border">
                    <CTab
                        aria-controls="private-tab-pane"
                        itemKey={1}
                        onClick={(e) => setForm({ ...form, type: 'private' })}
                    >
                        Private Person
                    </CTab>
                    <CTab
                        aria-controls="business-tab-pane"
                        itemKey={2}
                        onClick={(e) => setForm({ ...form, type: 'business' })}
                    >
                        Business
                    </CTab>
                </CTabList>
                <CTabContent>
                    <CTabPanel className="p-2" aria-labelledby="private-tab-pane" itemKey={1}>
                        <Form form={form} setForm={setForm} type="private" />
                    </CTabPanel>
                    <CTabPanel className="p-2" aria-labelledby="business-tab-pane" itemKey={2}>
                        <Form form={form} setForm={setForm} type="business" />
                    </CTabPanel>
                </CTabContent>
            </CTabs>
        </>
    )
}

export default ShippingAs

ShippingAs.propTypes = {
    form: PropTypes.object.isRequired,
    setForm: PropTypes.func.isRequired,
}

Form.propTypes = {
    form: PropTypes.object.isRequired,
    setForm: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
}
