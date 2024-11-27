import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCardText, CCardHeader } from '@coreui/react'
import Masonry from 'react-masonry-css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlaneDeparture, faTruck, faShip } from '@fortawesome/free-solid-svg-icons'

const Couriers = () => {
    const navigate = useNavigate()
    const result = [
        { name: 'xpress' },
        { name: 'ninja' },
        { name: 'lazada' },
        { name: 'shoppee' },
        { name: 'jnt' },
    ]

    return (
        <>
            <Masonry
                breakpointCols={{
                    default: 4,
                    1100: 3,
                    700: 2,
                    500: 1,
                }}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {result.map((courier, index) => (
                    <div key={index}>
                        <CCard className="bg-dark text-white mb-3" style={{ cursor: 'pointer' }}>
                            <CCardHeader
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <div></div>
                                <div>{courier.name}</div>
                            </CCardHeader>
                            <CCardBody>
                                <CCardText></CCardText>
                            </CCardBody>
                        </CCard>
                    </div>
                ))}
            </Masonry>
        </>
    )
}

export default Couriers
