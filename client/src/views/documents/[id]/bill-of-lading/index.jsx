import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { CSpinner, CCard, CCardBody, CCardTitle, CCardHeader, CRow, CCol } from '@coreui/react'

const BillOfLading = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState(null)

    const fetchData = async () => {
        try {
            const [freightResponse] = await Promise.all([axios.get(`/freight/${id}`)])
            setFormData(freightResponse.data)
        } catch (error) {
            console.error(error)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    if (!formData)
        return (
            <CRow className="justify-content-center my-5">
                <CCol md={6}>
                    <div className="clearfix">
                        <h1 className="float-start display-3 me-4 text-danger">OOPS</h1>
                        <h4>There was no shipment found.</h4>
                        <p>Double check tracking number for any mistake.</p>
                    </div>
                </CCol>
            </CRow>
        )

    return (
        <>
            <Helmet>
                <title>{id} - Bill of Lading - Documents | Axleshift</title>
            </Helmet>
            <div className="mb-3 font-monospace">
                <CCard>
                    <CCardHeader className="text-center">
                        <CCardTitle className="text-uppercase fw-bold fs-3">
                            Bill of Lading
                        </CCardTitle>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol md={6}>
                                <p>
                                    <strong>Shipment Number:</strong> {id}
                                </p>
                                <CRow>
                                    <CCol md={3}>
                                        <strong>Shipper:</strong>
                                    </CCol>
                                    <CCol>
                                        {formData.from[0].name}
                                        <br />
                                        <span>{formData.from[0].email}</span>
                                        <br />
                                        <span>{formData.from[0].phone_number}</span>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol md={3}>
                                        <strong>Receiver:</strong>
                                    </CCol>
                                    <CCol>
                                        {formData.to[0].name}
                                        <br />
                                        <span>{formData.to[0].email}</span>
                                        <br />
                                        <span>{formData.to[0].phone_number}</span>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol md={3}>
                                        <strong>Carrier:</strong>
                                    </CCol>
                                    <CCol>
                                        Coming soon
                                        <br />
                                        <span>Coming soon</span>
                                        <br />
                                        <span>Coming soon</span>
                                    </CCol>
                                </CRow>
                            </CCol>
                            <CCol md={6}>
                                <p>
                                    <strong>Origin:</strong> {formData.to[0].address}{' '}
                                    {formData.to[0].city}
                                </p>
                                <p>
                                    <strong>Destination:</strong> {formData.to[0].address}{' '}
                                    {formData.to[0].city}
                                </p>
                                <p>
                                    <strong>Date:</strong>{' '}
                                    {new Date(formData.created_at).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: '2-digit',
                                        year: 'numeric',
                                    })}
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
                                            <th>Height</th>
                                            <th>Width</th>
                                            <th>Length</th>
                                            <th>Weight</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.height} cm</td>
                                                <td>{item.width} cm</td>
                                                <td>{item.length} cm</td>
                                                <td>{item.weight} kg</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CCol>
                        </CRow>
                        <p>
                            <strong>Contains Documents:</strong>{' '}
                            {formData.contains_documents ? 'Yes' : 'No'}
                            <br />
                            <strong>Contains Danger Goods:</strong>{' '}
                            {formData.contains_danger_goods ? 'Yes' : 'No'}
                        </p>
                    </CCardBody>
                </CCard>
            </div>
        </>
    )
}

export default BillOfLading
