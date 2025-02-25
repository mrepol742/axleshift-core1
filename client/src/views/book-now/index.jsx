import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import Masonry from 'react-masonry-css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlaneDeparture, faTruck, faShip } from '@fortawesome/free-solid-svg-icons'
import Info from './fragments/info'

const ShipNow = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        isImport: false,
        isResidentialAddress: false,
        containsDangerGoods: false,
        containsDocuments: false,
        from: [
            {
                name: '',
                company: '',
                country: '',
                countryCode: '',
                city: '',
                zipCode: '',
                address: '',
                address2: '',
                address3: '',
                phone: '',
                email: '',
                taxId: '',
            },
        ],
        to: [
            {
                name: '',
                company: '',
                country: '',
                countryCode: '',
                city: '',
                zipCode: '',
                address: '',
                address2: '',
                address3: '',
                phone: '',
                email: '',
                employerId: '',
            },
        ],
        type: 'private',
        items: [],
    })

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}
            <Info data={{ form, setForm, loading, setLoading }} />
        </div>
    )
}

export default ShipNow
