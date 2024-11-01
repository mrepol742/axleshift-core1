import React from 'react'
import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
} from '@coreui/react'

const Activity = () => {
    return (
        <>
            <CTable hover responsive className="rounded-5 border border-2">
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell className="text-muted poppins-regular">
                            Actor
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-muted poppins-regular">
                            Type
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-muted poppins-regular">
                            Message
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-muted poppins-regular">
                            Created At
                        </CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    <CTableRow>
                        <CTableDataCell>You</CTableDataCell>
                        <CTableDataCell>Update user</CTableDataCell>
                        <CTableDataCell>
                            Update the user email address from &apos;example@g.com&apos; to
                            &apos;new@g.com&apos;
                        </CTableDataCell>
                        <CTableDataCell>{Date.now()}</CTableDataCell>
                    </CTableRow>
                </CTableBody>
            </CTable>
        </>
    )
}

export default Activity
