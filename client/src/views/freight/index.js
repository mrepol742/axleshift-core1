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

const Freight = () => {
    const navigate = useNavigate()

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
                        onClick={() => navigate('/freight/land')}
                        style={{ cursor: 'pointer' }}
                    >
                        <CCardImage src="/images/freight-land.jpg" />
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
                        onClick={() => navigate('/freight/air')}
                        style={{ cursor: 'pointer' }}
                    >
                        <CCardImage src="/images/freight-air.jpg" />
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
                        onClick={() => navigate('/freight/sea')}
                        style={{ cursor: 'pointer' }}
                    >
                        <CCardImage src="/images/freight-sea.jpg" />
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
