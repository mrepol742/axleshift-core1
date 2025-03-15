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
import Shipment from './shipment'
import countries from './countries'

const Form = ({ data, type, shipmentRef }) => {
    const { form, setForm, loading, setLoading } = data
    const formRef = React.useRef(null)
    const [shipment, setShipment] = useState(form.internal)

    const handleSwitchChange = (e) => {
        setForm({ ...form, isImport: e.target.checked })
    }

    const handleInputChange = (e, field) => {
        const [prefix, index, key] = field.split('.')
        const updatedField = [...form[prefix]]
        updatedField[index] = { ...updatedField[index], [key]: e.target.value }
        if (key === 'country') {
            const country = countries.find((c) => c.name === e.target.value)
            if (country) updatedField[index].countryCode = country.code
        }
        setForm({ ...form, [prefix]: updatedField })
    }

    const renderLocationFields = (prefix) => (
        <>
            <CRow xs={{ gutter: 2 }}>
                <CCol md>
                    <CFormInput
                        type="text"
                        floatingLabel="Country"
                        list={`${prefix}-country-list`}
                        value={form[prefix][0].country}
                        onChange={(e) => handleInputChange(e, `${prefix}.0.country`)}
                        required
                        disabled={form.status !== 'to_pay'}
                    />
                    <datalist id={`${prefix}-country-list`}>
                        {countries.map((country, index) => (
                            <option key={index} value={country.name} />
                        ))}
                    </datalist>
                </CCol>
                <CCol md>
                    <CFormInput
                        type="text"
                        floatingLabel={type === 'business' ? 'City' : 'City (Optional)'}
                        className="mb-2"
                        value={form[prefix][0].city}
                        onChange={(e) => handleInputChange(e, `${prefix}.0.city`)}
                        required={type === 'business'}
                        disabled={form.status !== 'to_pay'}
                    />
                    <CFormInput
                        type="number"
                        floatingLabel={type === 'business' ? 'Zip Code' : 'Zip Code (Optional)'}
                        value={form[prefix][0].zipCode}
                        onChange={(e) => handleInputChange(e, `${prefix}.0.zipCode`)}
                        required={type === 'business'}
                        disabled={form.status !== 'to_pay'}
                    />
                </CCol>
            </CRow>
            {prefix === 'to' && (
                <CFormCheck
                    label="Residential Address"
                    checked={form.isResidentialAddress}
                    onChange={(e) => setForm({ ...form, isResidentialAddress: e.target.checked })}
                    disabled={form.status !== 'to_pay'}
                />
            )}
        </>
    )

    return (
        <>
            <CForm ref={formRef}>
                <div className="d-flex justify-content-end">
                    <CFormSwitch
                        label="Import Statement"
                        checked={form.isImport}
                        onChange={handleSwitchChange}
                        disabled={form.status !== 'to_pay'}
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
            </CForm>

            {shipment && <Shipment data={data} shipmentRef={shipmentRef} />}
        </>
    )
}

const ShippingAs = ({ data }) => {
    const { form, setForm, loading, setLoading } = data
    const shipmentRef = React.useRef()

    return (
        <div ref={shipmentRef}>
            {!form.internal && (
                <>
                    <h3 className="text-primary">Ship Now</h3>
                    <p>You are a</p>
                </>
            )}
            <CTabs
                activeItemKey={form.internal ? (form.type === 'private' ? 1 : 2) : 1}
                className="mb-2"
            >
                <CTabList variant="underline-border">
                    <CTab
                        aria-controls="private-tab-pane"
                        itemKey={1}
                        disabled={form.internal}
                        onClick={(e) => setForm({ ...form, type: 'private' })}
                    >
                        Private Person
                    </CTab>
                    <CTab
                        aria-controls="business-tab-pane"
                        itemKey={2}
                        disabled={form.internal}
                        onClick={(e) => setForm({ ...form, type: 'business' })}
                    >
                        Business
                    </CTab>
                </CTabList>
                <CTabContent>
                    <CTabPanel className="p-2" aria-labelledby="private-tab-pane" itemKey={1}>
                        <Form data={data} shipmentRef={shipmentRef} type="private" />
                    </CTabPanel>
                    <CTabPanel className="p-2" aria-labelledby="business-tab-pane" itemKey={2}>
                        <Form data={data} shipmentRef={shipmentRef} type="business" />
                    </CTabPanel>
                </CTabContent>
            </CTabs>
        </div>
    )
}

export default ShippingAs

ShippingAs.propTypes = {
    data: PropTypes.object.isRequired,
}

Form.propTypes = {
    data: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    shipmentRef: PropTypes.object.isRequired,
}
