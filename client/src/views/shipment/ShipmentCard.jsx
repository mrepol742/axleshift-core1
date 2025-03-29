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

                <p className="text-muted d-block">
                    <span className="badge bg-dark me-2">{shipment.country}</span>
                    <span className="badge bg-dark me-2">{shipment.total_weight + 'kg '}</span>
                    {shipment.number_of_items > 1 && (
                        <>
                            <span className="badge bg-dark me-2">
                                {shipment.number_of_items + ' items'}
                            </span>
                        </>
                    )}
                    <span className="badge bg-dark me-2">
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: shipment.amount.currency,
                        }).format(shipment.amount.value)}
                    </span>
                </p>
            </CCardBody>
        </CCard>
    )
}

ShipmentCard.propTypes = {
    shipment: PropTypes.object.isRequired,
}

export default ShipmentCard
