import React from 'react'
import { CCard, CCardBody, CCardText, CCardHeader } from '@coreui/react'
import Masonry from 'react-masonry-css'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faLock, faServer, faKey } from '@fortawesome/free-solid-svg-icons'
import { useUserProvider } from '../../components/UserProvider'

const Freight = () => {
    const navigate = useNavigate()
    const { user } = useUserProvider()

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
                {user.role === 'admin' ||
                    (user.role === 'super_admin' && (
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
                                        <FontAwesomeIcon icon={faServer} />
                                    </div>
                                    <div>Management</div>
                                </CCardHeader>
                                <CCardBody>
                                    <CCardText>Your All in One Security Dashboard</CCardText>
                                </CCardBody>
                            </CCard>
                        </div>
                    ))}
                <div>
                    <CCard
                        className="bg-dark text-white mb-3"
                        onClick={() => navigate('/security/account-logs')}
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
                                <FontAwesomeIcon icon={faCircleNotch} />
                            </div>
                            <div>Account Logs</div>
                        </CCardHeader>
                        <CCardBody>
                            <CCardText>Logs account changes for security audits.</CCardText>
                        </CCardBody>
                    </CCard>
                </div>
                {user.role === 'admin' ||
                    (user.role === 'super_admin' && (
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
                                        <FontAwesomeIcon icon={faKey} />
                                    </div>
                                    <div>Access Token</div>
                                </CCardHeader>
                                <CCardBody>
                                    <CCardText>Make integration secure, fast and easy.</CCardText>
                                </CCardBody>
                            </CCard>
                        </div>
                    ))}
                <div>
                    <CCard
                        className="bg-dark text-white mb-3"
                        onClick={() => navigate('/security/device')}
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
                                <FontAwesomeIcon icon={faLock} />
                            </div>
                            <div>Sessions</div>
                        </CCardHeader>
                        <CCardBody>
                            <CCardText>
                                Manage your account session, remove unauthorized, unused and unknown
                                session.
                            </CCardText>
                        </CCardBody>
                    </CCard>
                </div>
            </Masonry>
        </>
    )
}

export default Freight
