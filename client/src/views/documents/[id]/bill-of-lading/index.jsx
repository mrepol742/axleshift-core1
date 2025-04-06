import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { CSpinner, CCard, CCardBody, CCardTitle, CCardHeader, CRow, CCol } from '@coreui/react'

const BillOfLading = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    return (
        <>
            <Helmet>
                <title>{id} - Bill of Lading - Documents | Axleshift</title>
            </Helmet>
            <div className="mb-3 font-monospace">
                <CCard>
                    <CCardHeader className="text-center mt-2">
                        <CCardTitle className="text-uppercase font-monospace">Bill of Lading</CCardTitle>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol md={6}>
                                <p>
                                    <strong>Tracking Number:</strong> {id}
                                </p>
                                <p>
                                    <strong>Shipper:</strong> John Doe Shipping Co.
                                </p>
                                <p>
                                    <strong>Consignee:</strong> Jane Smith Imports
                                </p>
                                <p>
                                    <strong>Carrier:</strong> Coming soon
                                </p>
                            </CCol>
                            <CCol md={6}>
                                <p>
                                    <strong>Origin:</strong> Los Angeles, CA
                                </p>
                                <p>
                                    <strong>Destination:</strong> New York, NY
                                </p>
                                <p>
                                    <strong>Date:</strong> October 15, 2023
                                </p>
                                <p>
                                    <strong>Mode of Transport:</strong> Coming soon
                                </p>
                            </CCol>
                        </CRow>
                        <CRow className="row mt-4">
                            <CCol md={12}>
                                <h6>Item Details</h6>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Description</th>
                                            <th>Quantity</th>
                                            <th>Weight</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Electronics</td>
                                            <td>50</td>
                                            <td>500 kg</td>
                                            <td>Handle with care</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Furniture</td>
                                            <td>20</td>
                                            <td>800 kg</td>
                                            <td>Fragile</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </CCol>
                        </CRow>
                    </CCardBody>
                    <div className="card-footer text-center">
                        <CSpinner color="primary" size="sm" />
                        <span className="ms-2">Loading additional details...</span>
                    </div>
                </CCard>
            </div>
        </>
    )
}

export default BillOfLading
