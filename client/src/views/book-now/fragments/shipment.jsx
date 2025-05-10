import React, { useState, useRef } from 'react'
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
    CCard,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import { useToast } from '../../../components/AppToastProvider'
import Review from './review'

const Item = ({ setShipping, index, form, setForm, removeItem }) => {
    const sizes = {
        // max dimensions 120cm x 80cm x 80cm
        // can only ship one item at a time
        private: [
            {
                value: [32, 24, 1],
                label: 'A4 Envelope',
            },
            {
                value: [23, 14, 4],
                label: 'One or two books',
            },
            {
                value: [35, 20, 15],
                label: 'Shoe box',
            },
            {
                value: [75, 35, 35],
                label: 'Moving box',
            },
        ],

        // max dimensions 302cm x 223cm x 220cm
        // can only ship dangerous goods
        business: [
            {
                value: [120, 80, 5],
                label: 'Pallet-1',
            },
            {
                value: [120, 100, 10],
                label: 'Pallet-2',
            },
            {
                value: [80, 60, 20],
                label: 'Pallet-3',
            },
            {
                value: [75, 35, 35],
                label: 'Moving box',
            },
        ],
    }

    const handleInputChange = (e, field) => {
        setShipping(false)
        const updatedItems = [...form.items]
        updatedItems[index] = { ...updatedItems[index], [field]: e.target.value }
        setForm({ ...form, items: updatedItems })
    }

    const handleSizeClick = (size) => {
        setShipping(false)
        const updatedItems = [...form.items]
        updatedItems[index] = {
            ...updatedItems[index],
            weight: 1,
            length: size[0],
            width: size[1],
            height: size[2] || '',
        }
        setForm({ ...form, items: updatedItems })
    }

    const calculateMaxWeight = (length, width, height) => {
        return Math.floor((length * width * height) / 139)
    }

    const maxWeight = calculateMaxWeight(
        form.items[index]?.length || 0,
        form.items[index]?.width || 0,
        form.items[index]?.height || 0,
    )

    return (
        <CCard className="mb-3 p-3">
            <div className="d-flex justify-content-between mb-2">
                {form.type === 'business' && <h5 className="text-primary">Item #{index + 1}</h5>}
                {form.type === 'private' && form.status !== 'to_pay' && (
                    <h5 className="text-primary">Item #{index + 1}</h5>
                )}
                {index > 0 && (
                    <CButton
                        color="danger"
                        onClick={() => removeItem(index)}
                        disabled={form.status !== 'to_pay'}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </CButton>
                )}
            </div>
            <CRow>
                <CCol md={3}>
                    <CFormInput
                        type="number"
                        floatingLabel="Weight (kg)"
                        required
                        className="mb-2"
                        value={form.items[index]?.weight || ''}
                        onChange={(e) => handleInputChange(e, 'weight')}
                        max={maxWeight}
                        min={1}
                        disabled={form.status !== 'to_pay'}
                    />
                </CCol>
                <CCol md={3}>
                    <CFormInput
                        type="number"
                        floatingLabel="Length (cm)"
                        required
                        className="mb-2"
                        value={form.items[index]?.length || ''}
                        onChange={(e) => handleInputChange(e, 'length')}
                        max={form.type === 'business' ? 302 : 120}
                        min={1}
                        disabled={form.status !== 'to_pay'}
                    />
                </CCol>
                <CCol md={3}>
                    <CFormInput
                        type="number"
                        floatingLabel="Width (cm)"
                        required
                        className="mb-2"
                        value={form.items[index]?.width || ''}
                        onChange={(e) => handleInputChange(e, 'width')}
                        max={form.type === 'business' ? 223 : 80}
                        min={1}
                        disabled={form.status !== 'to_pay'}
                    />
                </CCol>
                <CCol md={3}>
                    <CFormInput
                        type="number"
                        floatingLabel="Height (cm)"
                        required
                        className="mb-2"
                        value={form.items[index]?.height || ''}
                        onChange={(e) => handleInputChange(e, 'height')}
                        max={form.type === 'business' ? 220 : 80}
                        min={1}
                        disabled={form.status !== 'to_pay'}
                    />
                </CCol>
                {form.type === 'business' && (
                    <CCol md={3}>
                        <CFormInput
                            type="number"
                            floatingLabel="Quantity"
                            required
                            className="mb-2"
                            value={form.items[index]?.quantity || ''}
                            onChange={(e) => handleInputChange(e, 'quantity')}
                            max={99}
                            min={1}
                            disabled={form.status !== 'to_pay'}
                        />
                    </CCol>
                )}
            </CRow>
            {form.status === 'to_pay' && (
                <>
                    <hr />
                    <h6>Need help with sizes?</h6>
                    <div className="d-block d-md-flex justify-content-between">
                        {sizes[form.type].map((item, idx) => (
                            <div
                                key={idx}
                                className="border rounded p-2 mb-2 me-2 w-100"
                                onClick={() => handleSizeClick(item.value)}
                                style={{ cursor: 'pointer' }}
                            >
                                {item.label}
                                <span className="d-block text-muted">
                                    {item.value.join(' x ')} cm
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </CCard>
    )
}

const Shipment = ({ data, shipmentRef }) => {
    const { form, setForm, loading, setLoading } = data
    const navigate = useNavigate()
    const [items, setItems] = useState(form.items.length > 0 ? form.items : [{}])
    const formRef = useRef(null)
    const [shipping, setShipping] = useState(form.internal)
    const recaptchaRef = useRef()
    const { addToast } = useToast()

    const addItem = () => {
        if (items.length < 5) {
            setShipping(false)
            setItems([...items, {}])
        }
    }

    const removeItem = (index) => {
        setShipping(false)
        setItems(items.filter((_, i) => i !== index))
        const updatedItems = form.items.filter((_, i) => i !== index)
        setForm({ ...form, items: updatedItems })
    }

    const totalWeight = () => {
        return form.items.reduce((acc, item) => acc + item.weight * (item.quantity || 1), 0)
    }

    return (
        <>
            <CForm ref={formRef}>
                <h3 className="text-primary mt-4" id="shipment">
                    Shipment
                </h3>
                {items.map((item, index) => (
                    <Item
                        setShipping={setShipping}
                        key={index}
                        index={index}
                        form={form}
                        setForm={setForm}
                        removeItem={removeItem}
                    />
                ))}

                <CRow>
                    <CCol md>
                        {form.status === 'to_pay' && form.type === 'business' && (
                            <CButton
                                color="primary"
                                onClick={addItem}
                                className={items.length >= 5 ? 'disabled' : ''}
                            >
                                Add Item
                            </CButton>
                        )}
                        <span className="d-block">Total Weight: {totalWeight()} kg</span>
                    </CCol>
                    <CCol md>
                        This shipment contains:
                        {form.type === 'business' && (
                            <CFormCheck
                                label="Danger Goods"
                                checked={form.containsDangerGoods}
                                onChange={(e) =>
                                    setForm({ ...form, containsDangerGoods: e.target.checked })
                                }
                                disabled={form.status !== 'to_pay'}
                            />
                        )}
                        <CFormCheck
                            label="Documents"
                            checked={form.containsDocuments}
                            onChange={(e) =>
                                setForm({ ...form, containsDocuments: e.target.checked })
                            }
                            className="mb-2"
                            disabled={form.status !== 'to_pay'}
                        />
                        {!shipping && (
                            <CButton
                                className="btn btn-primary px-5"
                                onClick={() => {
                                    // if (form.type === 'private' && form.items.length > 1) {
                                    //     setForm({ ...form, items: [form.items[0]] })
                                    // }
                                    if (formRef.current.checkValidity()) {
                                        setShipping(true)
                                        setTimeout(() => {
                                            const element = document.getElementById('review')
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth' })
                                            }
                                        }, 0)
                                    } else {
                                        formRef.current.reportValidity()
                                    }
                                }}
                            >
                                Ship Now
                            </CButton>
                        )}
                    </CCol>
                </CRow>
            </CForm>
            {form.status === 'to_pay' && shipping && (
                <Review data={data} shipmentRef={shipmentRef} />
            )}

            {!['to_pay', 'cancelled'].includes(form.status) && (
                <div className="d-flex align-items-right justify-content-end">
                    <CButton
                        className="btn btn-primary px-4 mt-3"
                        onClick={(e) => navigate(`/track/${form.tracking_number}`)}
                    >
                        Track your shipment
                    </CButton>
                </div>
            )}
        </>
    )
}

export default Shipment

Shipment.propTypes = {
    data: PropTypes.object.isRequired,
    shipmentRef: PropTypes.object.isRequired,
}

Item.propTypes = {
    setShipping: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    setForm: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
}
