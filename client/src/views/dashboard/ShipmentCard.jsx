import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCardFooter, CCardText } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlaneDeparture, faTruck, faShip } from '@fortawesome/free-solid-svg-icons'
import { parseTimestamp } from '../../components/Timestamp'

const ShipmentCard = ({ shipment }) => {
    const navigate = useNavigate()

    const getCardColor = (status) => {
        if (status === 'cancelled') return 'danger'
        if (status === 'received') return 'primary'
        if (status === 'in_route' || status === 'in_ship') return 'warning'
        // for to_pay
        return ''
    }

    const getStatus = (status) => {
        if (status === 'cancelled') return 'Cancelled'
        if (status === 'received') return 'Received'
        if (status === 'in_route') return 'To Receive'
        if (status === 'in_ship') return 'To Ship'
        // for to_pay
        return 'Unknown'
    }

    return (
        <CCard
            color={getCardColor(shipment.status)}
            className="mb-3"
            key={shipment._id}
            onClick={() => navigate(`/v/${shipment._id}`)}
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
                <div>
                    {shipment.type == 'air' && <FontAwesomeIcon icon={faPlaneDeparture} />}
                    {shipment.type == 'land' && <FontAwesomeIcon icon={faTruck} />}
                    {shipment.type == 'sea' && <FontAwesomeIcon icon={faShip} />}
                </div>
            </CCardHeader>
            <CCardBody>
                <CCardText>
                    <div className="mb-2">
                        <small className="text-muted d-block">Courier</small>
                        Shoppe SPX
                    </div>
                    <div className="mb-2">
                        <small className="text-muted d-block">Shipment</small>
                        {shipment.data.shipment.shipment_description}
                    </div>
                </CCardText>
            </CCardBody>
            <CCardFooter className="border-0 small bg-transparent">
                <small className="text-muted d-block">Last update</small>
                {parseTimestamp(shipment.updated_at)} ago
            </CCardFooter>
        </CCard>
    )
}

ShipmentCard.propTypes = {
    shipment: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['air', 'land', 'sea']).isRequired,
        data: PropTypes.shape({
            shipment: PropTypes.shape({
                shipment_description: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
        updated_at: PropTypes.string.isRequired,
    }).isRequired,
}

export default ShipmentCard
