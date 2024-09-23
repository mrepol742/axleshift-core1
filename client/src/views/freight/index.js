import React from 'react'

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
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import FreightAir from '../../assets/images/freight-air.jpg'
import FreightLand from '../../assets/images/freight-land.jpg'
import FreightSea from '../../assets/images/freight-sea.jpg'

const Freight = () => {
    const navigate = useNavigate()

    const freightLand = () => {
        navigate('/freight/land')
    }

    const freightAir = () => {
        navigate('/freight/air')
    }

    const freightSea = () => {
        navigate('/freight/sea')
    }

    return (
        <>
            <CRow
                xs={{ cols: 1, gutter: 2 }}
                md={{ cols: 2, gutter: 2 }}
                lg={{ cols: 3, gutter: 2 }}
            >
                <CCol>
                    <CCard
                        className="mb-3 bg-dark text-white"
                        onClick={freightLand}
                        style={{ cursor: 'pointer' }}
                    >
                        <CCardImage src={FreightLand}/>
                        <CCardImageOverlay style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                            <CCardTitle>Land Freight</CCardTitle>
                            <CCardText>
                                Efficient ground transportation solutions for reliable delivery
                                across vast distances.
                            </CCardText>
                        </CCardImageOverlay>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard
                        className="mb-3 bg-dark text-white"
                        onClick={freightAir}
                        style={{ cursor: 'pointer' }}
                    >
                        <CCardImage src={FreightAir} />
                        <CCardImageOverlay style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                            <CCardTitle>Air Freight</CCardTitle>
                            <CCardText>
                                Rapid air freight services ensuring swift global reach for
                                time-sensitive shipments.
                            </CCardText>
                        </CCardImageOverlay>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard
                        className="mb-3 bg-dark text-white"
                        onClick={freightSea}
                        style={{ cursor: 'pointer' }}
                    >
                        <CCardImage src={FreightSea} />
                        <CCardImageOverlay style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                            <CCardTitle>Sea Freight</CCardTitle>
                            <CCardText>
                                Cost-effective ocean freight options for bulk shipments over long
                                distances.
                            </CCardText>
                        </CCardImageOverlay>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default Freight
