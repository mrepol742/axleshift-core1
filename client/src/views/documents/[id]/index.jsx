import React, { useState } from 'react'
import { Container, Row, Col, Card, Button, Table, Form } from 'react-bootstrap'

const Document = () => {
    const [documents, setDocuments] = useState([
        { name: 'Commercial Invoice', type: 'Customs Document', status: 'Pending' },
        { name: 'Packing List', type: 'Customs Document', status: 'Approved' },
        { name: 'Export License', type: 'Permit & License', status: 'Pending' },
        { name: 'Certificate of Origin', type: 'Regulatory Certificate', status: 'Rejected' },
    ])

    const handleFileUpload = (event, index) => {
        const newDocs = [...documents]
        newDocs[index].status = 'Under Review'
        setDocuments(newDocs)
    }

    return (
        <>
            <Container className="mt-4">
                <h2>Upload Documents</h2>
                <p>
                    Please ensure that the documents you upload are authentic and not counterfeit.
                    Uploading fraudulent documents may result in legal consequences.
                </p>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th>Document Name</th>
                                            <th>Type</th>
                                            <th>Status</th>
                                            <th>Upload</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documents.map((doc, index) => (
                                            <tr key={index}>
                                                <td>{doc.name}</td>
                                                <td>{doc.type}</td>
                                                <td>
                                                    <span
                                                        className={`badge bg-${doc.status === 'Approved' ? 'success' : doc.status === 'Rejected' ? 'danger' : 'warning'}`}
                                                    >
                                                        {doc.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Form.Group controlId={`fileUpload-${index}`}>
                                                        <Form.Control
                                                            type="file"
                                                            onChange={(e) =>
                                                                handleFileUpload(e, index)
                                                            }
                                                        />
                                                    </Form.Group>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <Button variant="primary">Submit Documents</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Document
