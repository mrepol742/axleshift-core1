import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CCardGroup,
    CCard,
    CCol,
    CRow,
    CCardBody,
    CCardTitle,
    CCardImageOverlay,
    CCardText,
    CCardImage,
    CCardHeader,
    CCarousel,
    CCarouselItem,
    CImage,
} from '@coreui/react'
import Masonry from 'react-masonry-css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlaneDeparture, faTruck, faShip } from '@fortawesome/free-solid-svg-icons'

const Freight = () => {
    const navigate = useNavigate()

    return (
        <>
            <h3>Select your preffered Freight Option</h3>
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
                <div>
                    <CCard
                        className="bg-dark text-white mb-3"
                        onClick={() => navigate('/security/management')}
                        style={{ cursor: 'pointer' }}
                    >
                        <CCardHeader
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <FontAwesomeIcon icon={faTruck} />
                            </div>
                            <div>Land Freight</div>
                        </CCardHeader>
                        <CCardBody>
                            <CCardText>
                                Efficient ground transportation solutions for reliable delivery
                                across vast distances.
                            </CCardText>
                        </CCardBody>
                    </CCard>
                </div>
                <div>
                    <CCard
                        className="bg-dark text-white mb-3"
                        onClick={() => navigate('/security/analysis')}
                        style={{ cursor: 'pointer' }}
                    >
                        <CCardHeader
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <FontAwesomeIcon icon={faPlaneDeparture} />
                            </div>
                            <div>Air Freight</div>
                        </CCardHeader>
                        <CCardBody>
                            <CCardText>
                                Rapid air freight services ensuring swift global reach for
                                time-sensitive shipments.
                            </CCardText>
                        </CCardBody>
                    </CCard>
                </div>
                <div>
                    <CCard
                        className="bg-dark text-white mb-3"
                        onClick={() => navigate('/security/apikey')}
                        style={{ cursor: 'pointer' }}
                    >
                        <CCardHeader
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <FontAwesomeIcon icon={faShip} />
                            </div>
                            <div>Sea Freight</div>
                        </CCardHeader>
                        <CCardBody>
                            <CCardText>
                                Cost-effective ocean freight options for bulk shipments over long
                                distances.
                            </CCardText>
                        </CCardBody>
                    </CCard>
                </div>
            </Masonry>
        </>
    )
}

export default Freight
