import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCardFooter, CCardText } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlaneDeparture, faTruck, faShip } from '@fortawesome/free-solid-svg-icons'
import parseTimestamp from '../../utils/Timestamp'

const ShipmentCard = ({ shipment }) => {
    const navigate = useNavigate()

    const getCardColor = (status) => {
        if (status === 'cancelled') return 'danger'
        if (status === 'received') return 'primary'
        if (status === 'to_receive' || status === 'to_ship') return 'warning'
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

    const totalWeight = (items) => {
        return `${items.reduce((acc, item) => acc + parseFloat(item.weight), 0)} kg`
    }

    return (
        <CCard
            color={getCardColor(shipment.status)}
            className="mb-3"
            key={shipment.tracking_number}
            onClick={() => navigate(`/shipment/${shipment.tracking_number}`)}
            style={{ cursor: 'pointer' }}
        >
            <CCardHeader
                className="border-0"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>{getStatus(shipment.status)}</div>
                <div>{parseTimestamp(shipment.updated_at)}</div>
            </CCardHeader>
            <CCardBody>
                <div className="mb-2">
                    <small className="text-muted d-block">Courier</small>
                    Shoppe SPX
                </div>
                <div className="mb-2">
                    <small className="text-muted d-block">Tracing number</small>
                    {shipment.tracking_number || 'N/A'}
                </div>
                {(shipment.status === 'to_ship' || shipment.status === 'to_receive') && (
                    <div className="mb-2">
                        <small className="text-muted d-block">Delivery on</small>
                        Today
                    </div>
                )}

                <div className="mb-2">
                    <small className="text-muted d-block">
                        {JSON.stringify(shipment.to)}
                        {shipment.country} | {shipment.total_weight + 'kg'}
                        {shipment.number_of_items > 1
                            ? ' | ' + shipment.number_of_items + ' items |'
                            : ''}
                        | {shipment.amount?.currency + ' ' + shipment.amount?.value}
                    </small>
                </div>
            </CCardBody>
        </CCard>
    )
}

ShipmentCard.propTypes = {
    shipment: PropTypes.object.isRequired,
}

export default ShipmentCard
