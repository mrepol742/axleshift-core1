import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCardText, CCardHeader } from '@coreui/react'
import Masonry from 'react-masonry-css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlaneDeparture, faTruck, faShip } from '@fortawesome/free-solid-svg-icons'
import Info from './fragments/info'

const ShipNow = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        isImport: false,
        isResidentialAddress: false,
        containsDangerGoods: false,
        containsDocuments: false,
        fromCountry: '',
        fromCity: '',
        fromZipCode: '',
        toCountry: '',
        toCity: '',
        toZipCode: '',
        type: 'private',
        items: [],
    })

    return (
        <div>
            <Info form={form} setForm={setForm} />
        </div>
    )
}

export default ShipNow
