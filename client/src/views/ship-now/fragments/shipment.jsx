import React from 'react'
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

const Item = ({ index, form, setForm, removeItem }) => {
    const sizes = {
        // max weight 70kg
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
        // max weight 2500kg
        // max dimensions 302cm x 223cm x 220cm
        // can only ship dangerous goods
        business: [
            {
                value: [120, 80],
                label: 'Pallet-1',
            },
            {
                value: [120, 100],
                label: 'Pallet-2',
            },
            {
                value: [80, 60],
                label: 'Pallet-3',
            },
            {
                value: [75, 35, 35],
                label: 'Moving box',
            },
        ],
    }

    const handleInputChange = (e, field) => {
        const updatedItems = [...form.items]
        updatedItems[index] = { ...updatedItems[index], [field]: e.target.value }
        setForm({ ...form, items: updatedItems })
    }

    const handleSizeClick = (size) => {
        const updatedItems = [...form.items]
        updatedItems[index] = {
            ...updatedItems[index],
            length: size[0],
            width: size[1],
            height: size[2] || '',
        }
        setForm({ ...form, items: updatedItems })
    }

    return (
        <CCard className="mb-3 p-3">
            <div className="d-flex justify-content-between">
                {form.type === 'business' && <h5 className="text-primary">Item #{index + 1}</h5>}
                {index > 0 && (
                    <CButton color="danger" onClick={() => removeItem(index)}>
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
                    />
                </CCol>
                <CCol md={3}>
                    <CFormInput
                        type="number"
                        floatingLabel="Quantity"
                        required
                        className="mb-2"
                        value={form.items[index]?.quantity || ''}
                        onChange={(e) => handleInputChange(e, 'quantity')}
                    />
                </CCol>
            </CRow>
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
                        <span className="d-block text-muted">{item.value.join(' x ')} cm</span>
                    </div>
                ))}
            </div>
        </CCard>
    )
}

const Shipment = ({ form, setForm }) => {
    const navigate = useNavigate()
    const [items, setItems] = React.useState([{}])

    const addItem = () => {
        if (items.length < 5) {
            setItems([...items, {}])
        }
    }

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index))
        const updatedItems = form.items.filter((_, i) => i !== index)
        setForm({ ...form, items: updatedItems })
    }
    const totalWeight = () => {
        return form.items.reduce((acc, item) => acc + (item.weight * item.quantity || 0), 0)
    }

    return (
        <>
            <h3 className="text-primary mt-4" id="shipment">
                Shipment
            </h3>
            {items.map((item, index) => (
                <Item
                    key={index}
                    index={index}
                    form={form}
                    setForm={setForm}
                    removeItem={removeItem}
                />
            ))}

            <CRow>
                <CCol md>
                    {form.type === 'business' && (
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
                        />
                    )}
                    <CFormCheck
                        label="Documents"
                        checked={form.containsDocuments}
                        onChange={(e) => setForm({ ...form, containsDocuments: e.target.checked })}
                        className="mb-2"
                    />
                    <CButton
                        className="btn btn-primary px-5"
                        onClick={() => {
                            alert(JSON.stringify(form))
                        }}
                    >
                        Ship Now
                    </CButton>
                </CCol>
            </CRow>
        </>
    )
}

export default Shipment

Shipment.propTypes = {
    form: PropTypes.object.isRequired,
    setForm: PropTypes.func.isRequired,
}

Item.propTypes = {
    index: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    setForm: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
}
