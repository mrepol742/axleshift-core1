import React, { useState, useEffect } from 'react'
import {
    CSpinner,
    CAccordion,
    CAccordionBody,
    CAccordionHeader,
    CAccordionItem,
    CBadge,
    CRow,
    CCol,
    CImage,
    CCard,
    CCardBody,
    CCardTitle,
    CButton,
} from '@coreui/react'
import { VITE_APP_AWS_S3 } from '../../../config'
import { useToast } from '../../../components/AppToastProvider'
import parseTimestamp from '../../../utils/Timestamp'
import AppPagination from '../../../components/AppPagination'
import { useNavigate } from 'react-router-dom'

const Users = () => {
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const navigate = useNavigate()

    const fetchData = async (page) => {
        axios
            .post(`/sec/management/users`, { page })
            .then((response) => {
                setResult(response.data.data)
                setTotalPages(response.data.totalPages)
            })
            .catch((error) => {
                const message =
                    error.response?.data?.error ||
                    (error.message === 'network error'
                        ? 'Server is offline or restarting please wait'
                        : error.message)
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData(currentPage)
    }, [currentPage])

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : ''
    }

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    return (
        <div>
            <CCard className="mb-4">
                <CCardBody>
                    <CCardTitle>Axleshift Users</CCardTitle>
                    <CAccordion flush>
                        {result.map((user, index) => (
                            <CAccordionItem itemKey={index} key={index}>
                                <CAccordionHeader>
                                    <div className="d-flex">
                                        {user.avatar ? (
                                            <>
                                                <CImage
                                                    crossOrigin="Anonymous"
                                                    src={`${VITE_APP_AWS_S3}/images/${user.avatar}.png`}
                                                    className="rounded-pill p-1 border me-2"
                                                    width="25px"
                                                    fluid
                                                    loading="lazy"
                                                />
                                            </>
                                        ) : (
                                            <div
                                                className="rounded-pill bg-primary d-flex align-items-center justify-content-center me-2 fs-6"
                                                style={{
                                                    width: '25px',
                                                    height: '25px',
                                                    color: 'white',
                                                }}
                                            >
                                                {getInitials(user.first_name)}
                                            </div>
                                        )}
                                        <span className="me-2">
                                            {user.first_name} {user.last_name}
                                        </span>{' '}
                                        <CBadge color="secondary" className="text-capitalize">
                                            {user.role.replace('_', ' ')}
                                        </CBadge>
                                    </div>
                                </CAccordionHeader>
                                <CAccordionBody>
                                    <CRow>
                                        <CCol>
                                            <strong>First name:</strong> {user.first_name}
                                        </CCol>
                                        <CCol>
                                            <strong>Last name:</strong> {user.last_name}
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol>
                                            <strong>Username:</strong> {user.username}
                                        </CCol>
                                        <CCol>
                                            <strong>Email:</strong> {user.email}
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol>
                                            <strong>Registration Type:</strong>{' '}
                                            {user.registration_type}
                                        </CCol>
                                        <CCol>
                                            <strong>Registration Date:</strong>{' '}
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol>
                                            <strong>Google:</strong>{' '}
                                            {user.oauth2 ? user.oauth2.google?.email : 'No'}
                                        </CCol>
                                        <CCol>
                                            <strong>Github:</strong>{' '}
                                            {user.oauth2 ? user.oauth2.github?.email : 'No'}
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol>
                                            <strong>Microsoft:</strong>{' '}
                                            {user.oauth2 ? user.oauth2.microsoft?.email : 'No'}
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol>
                                            <strong>Last Password Changed:</strong>{' '}
                                            {user.password_changed_on
                                                ? new Date(
                                                      user.password_changed_on,
                                                  ).toLocaleDateString()
                                                : 'NaN'}
                                        </CCol>
                                        <CCol>
                                            <strong>Last Username Changed:</strong>{' '}
                                            {user.username_last_updated_at
                                                ? new Date(
                                                      user.username_last_updated_at,
                                                  ).toLocaleDateString()
                                                : 'NaN'}
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol>
                                            <strong>Last Email Changed:</strong>{' '}
                                            {user.email_changed_on
                                                ? new Date(
                                                      user.email_changed_on,
                                                  ).toLocaleDateString()
                                                : 'NaN'}
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol>
                                            <strong>User ID:</strong> {user._id}
                                        </CCol>
                                        <CCol>
                                            <strong>User Reference:</strong> {user.ref}
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-4">
                                        <CCol>
                                            <strong>User Role:</strong>{' '}
                                            <span className="text-capitalize">
                                                {user.role.replace('_', ' ')}
                                            </span>
                                        </CCol>
                                    </CRow>
                                    <small>
                                        Updated at {new Date(user.updated_at).toLocaleDateString()}
                                    </small>
                                    <div className="d-flex">
                                        <CButton
                                            color="primary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() =>
                                                navigate(`/send-email?email=${user.email}`)
                                            }
                                        >
                                            Email
                                        </CButton>
                                        <CButton
                                            color="success"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => {}}
                                        >
                                            Message
                                        </CButton>
                                        <CButton
                                            color="danger"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => {}}
                                        >
                                            Delete User
                                        </CButton>
                                    </div>
                                </CAccordionBody>
                            </CAccordionItem>
                        ))}
                    </CAccordion>
                </CCardBody>
            </CCard>
            {totalPages > 1 && (
                <AppPagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    setTotalPages={setTotalPages}
                />
            )}
        </div>
    )
}

export default Users
