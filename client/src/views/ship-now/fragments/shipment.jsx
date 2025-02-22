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
    return (
        <CCard className="mb-3 p-3">
            <div className="d-flex justify-content-between">
                <h3 className="text-primary">#{index + 1}</h3>
                {index > 0 && (
                    <CButton color="danger" onClick={() => removeItem(index)}>
                        <FontAwesomeIcon icon={faXmark} />
                    </CButton>
                )}
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
    }

    return (
        <>
            <h3 className="text-primary">Shipment</h3>
            {items.map((item, index) => (
                <Item
                    key={index}
                    index={index}
                    form={form}
                    setForm={setForm}
                    removeItem={removeItem}
                />
            ))}

            <div className="d-flex justify-content-between">
                <div>
                    <CButton
                        color="primary"
                        onClick={addItem}
                        className={items.length >= 5 ? 'disabled' : ''}
                    >
                        Add Item
                    </CButton>
                    <span className="d-block">Total Weight: 0 kg</span>
                </div>
                <div>
                    This shipment contains:
                    <CFormCheck
                        label="Danger Goods"
                        checked={form.containsDangerGoods}
                        onChange={(e) =>
                            setForm({ ...form, containsDangerGoods: e.target.checked })
                        }
                    />
                    <CFormCheck
                        label="Documents"
                        checked={form.containsDocuments}
                        onChange={(e) => setForm({ ...form, containsDocuments: e.target.checked })}
                    />
                    <CButton
                        className="btn btn-primary px-5"
                        onClick={() => {
                            alert(JSON.stringify(form))
                        }}
                    >
                        Ship Now
                    </CButton>
                </div>
            </div>
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
