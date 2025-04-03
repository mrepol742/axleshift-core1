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
        if (status === 'to_receive' || status === 'to_ship') return 'info'
        // for to_pay
        return ''
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
            color={getCardColor(shipment.status)}
            className="mb-3"
            key={shipment.tracking_number}
            onClick={() => navigate(`/shipment/${shipment.tracking_number}`)}
            style={{ cursor: 'pointer' }}
        >
            <CCardBody>
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
            </CCardBody>
            <CCardFooter>
                <div className="d-flex justify-content-between">
                    <div>
                        <small className="text-muted d-block">Status</small>
                        {getStatus(shipment.status)}
                    </div>
                    <div>
                        <small className="text-muted d-block">Update</small>
                        {parseTimestamp(shipment.updated_at)}
                    </div>
                </div>
            </CCardFooter>
        </CCard>
    )
}

ShipmentCard.propTypes = {
    shipment: PropTypes.object.isRequired,
}

export default ShipmentCard
