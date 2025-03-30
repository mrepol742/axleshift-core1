import React from 'react'
import parseTimestamp from '../../../utils/Timestamp'
import PropTypes from 'prop-types'

const Inbox = ({ threadsID, selectedUser, handleSelectUser, isMobile }) => {
    return (
        <div
            style={{
                width: isMobile ? '100%' : '30%',
                overflowY: 'auto',
                borderTopLeftRadius: '12px',
                borderBottomLeftRadius: isMobile ? '0' : '12px',
                borderTopRightRadius: isMobile ? '12px' : '0',
                height: isMobile ? '100%' : 'auto',
            }}
        >
            {threadsID.map((thread) => (
                <div
                    key={thread.id}
                    onClick={() => handleSelectUser(thread)}
                    className={`${selectedUser?.id === thread.id && 'bg-body-secondary fw-bold'} d-flex align-items-center px-3 py-2 border-bottom`}
                    style={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                >
                    <div
                        className="bg-primary fw-bold rounded-pill me-3 d-flex justify-content-center align-items-center text-white"
                        style={{
                            width: '36px',
                            height: '36px',
                        }}
                    >
                        {thread.id.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-grow-1">
                        <div className="fw-bold" style={{ fontSize: '14px' }}>
                            {thread.id.slice(0, 6).toUpperCase()}
                        </div>
                        <div style={{ fontSize: '11px' }} className="text-muted">
                            {parseTimestamp(thread.timestamp)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Inbox

Inbox.propTypes = {
    threadsID: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        }),
    ).isRequired,
    selectedUser: PropTypes.shape({
        id: PropTypes.string,
    }),
    handleSelectUser: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
}
