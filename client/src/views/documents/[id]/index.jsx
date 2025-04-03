import React, { useState } from 'react'
import {
    CCard,
    CButton,
    CFormInput,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CCardBody,
} from '@coreui/react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

const Document = () => {
    const { id } = useParams()
    const [documents, setDocuments] = useState([
        { name: 'Commercial Invoice', type: 'Customs Document', status: 'Pending' },
        { name: 'Packing List', type: 'Customs Document', status: 'Pending' },
        { name: 'Export License', type: 'Permit & License', status: 'Pending' },
        { name: 'Certificate of Origin', type: 'Regulatory Certificate', status: 'Pending' },
    ])

    const handleFileUpload = (event, index) => {
        const newDocs = [...documents]
        newDocs[index].status = 'Under Review'
        setDocuments(newDocs)
    }

    return (
        <>
            <Helmet>
                <title>{id} - Documents | Axleshift</title>
            </Helmet>
            <div>
                <h2>Upload Documents</h2>
                <span className="text-muted">{id}</span>
                <CCard className="mt-2 mb-3">
                    <CCardBody>
                        <CTable stripedColumns hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell className="text-uppercase fw-bold text-muted poppins-regular table-header-cell-no-wrap">
                                        Document Name
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-uppercase fw-bold text-muted poppins-regular table-header-cell-no-wrap">
                                        Type
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-uppercase fw-bold text-muted poppins-regular table-header-cell-no-wrap">
                                        Status
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-uppercase fw-bold text-muted poppins-regular table-header-cell-no-wrap">
                                        Upload
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {documents.map((doc, index) => (
                                    <CTableRow key={index}>
                                        <CTableDataCell>{doc.name}</CTableDataCell>
                                        <CTableDataCell>{doc.type}</CTableDataCell>
                                        <CTableDataCell>
                                            <span
                                                className={`badge bg-${doc.status === 'Approved' ? 'success' : doc.status === 'Rejected' ? 'danger' : 'warning'}`}
                                            >
                                                {doc.status}
                                            </span>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <CFormInput
                                                type="file"
                                                onChange={(e) => handleFileUpload(e, index)}
                                            />
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                        <span className="d-block mb-2 small">
                            Please ensure that the documents you upload are authentic and not
                            counterfeit. Uploading fraudulent documents may result in legal
                            consequences.
                        </span>
                        <CButton color="primary">Submit Documents</CButton>
                    </CCardBody>
                </CCard>
            </div>
        </>
    )
}

export default Document
