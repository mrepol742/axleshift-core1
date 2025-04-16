import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCardFooter,
    CCardText,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlaneDeparture, faTruck, faShip } from '@fortawesome/free-solid-svg-icons'
import parseTimestamp from '../../utils/Timestamp'

const ShipmentCard = ({ shipment }) => {
    const navigate = useNavigate()

    const getCardColor = (status) => {
        if (status === 'cancelled') return 'danger'
        if (status === 'received') return 'primary'
        if (status === 'to_receive' || status === 'to_ship') return 'success'
        // for to_pay
        return 'info'
    }

    const getStatus = (status) => {
        if (status === 'cancelled') return 'Cancelled'
        if (status === 'received') return 'Received'
        if (status === 'to_receive') return 'To Receive'
        if (status === 'to_ship') return 'To Ship'
        // for to_pay
        return 'To Pay'
    }

    return (
        <CCard
            className={`mb-3 border-${getCardColor(shipment.status)}`}
            key={shipment.tracking_number}
            onClick={() => navigate(`/shipment/${shipment.tracking_number}`)}
            style={{ cursor: 'pointer' }}
        >
            <div className={`bg-${getCardColor(shipment.status)} rounded p-3 m-2`}>
                <div className="d-flex justify-content-between text-white">
                    <div>
                        <small className="d-block fw-bold">Status</small>
                        {getStatus(shipment.status)}
                    </div>
                    <div>
                        <small className="d-block fw-bold">Update</small>
                        {parseTimestamp(shipment.updated_at)}
                    </div>
                </div>
            </div>
            <div className="px-2 mx-1">
                {shipment.courier !== 'none' && (
                    <div className="mb-2">
                        <small className="text-muted d-block">Courier</small>
                        {shipment.courier}
                    </div>
                )}

                <div className="mb-2">
                    <small className="text-muted d-block">Tracing number</small>
                    {shipment.tracking_number}
                </div>

                <div className="mb-2">
                    <small className="text-muted d-block">To Country</small>
                    {shipment.country}
                </div>

                <div className="mb-2">
                    <small className="text-muted d-block">Items/Weight</small>
                    {shipment.number_of_items + ' items'} {shipment.total_weight + 'kg '}
                </div>

                <div className="mb-2">
                    <small className="text-muted d-block">Amount</small>
                    {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: shipment.amount.currency,
                    }).format(shipment.amount.value)}
                </div>
            </div>
        </CCard>
    )
}

ShipmentCard.propTypes = {
    shipment: PropTypes.object.isRequired,
}

export default ShipmentCard
