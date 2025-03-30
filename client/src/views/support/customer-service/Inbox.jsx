import React from 'react'
import parseTimestamp from '../../../utils/Timestamp'

const Inbox = ({ threadsID, selectedUser, handleSelectUser, isMobile }) => {
    return (
        <div
            style={{
                width: isMobile ? '100%' : '30%',
                borderRight: isMobile ? 'none' : '1px solid #c2d68a',
                borderBottom: isMobile ? '1px solid #c2d68a' : 'none',
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
                    className="d-flex align-items-center px-3 py-2"
                    style={{
                        cursor: 'pointer',
                        fontWeight: selectedUser?.id === thread.id ? 'bold' : 'normal',
                        backgroundColor:
                            selectedUser?.id === thread.id ? '#e0f19c80' : 'transparent',
                        borderLeft: thread.unread ? '3px solid #55785E' : '3px solid transparent',
                        transition: 'all 0.2s ease',
                        borderBottom: '1px solid #d9e6c480',
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
                        <div className="fw-bold" style={{ color: '#2d4739', fontSize: '14px' }}>
                            {thread.id.slice(0, 6).toUpperCase()}
                        </div>
                        <div style={{ fontSize: '12px', color: '#55785E' }}></div>
                        <div style={{ fontSize: '11px', color: 'gray' }}>
                            {parseTimestamp(thread.timestamp)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Inbox
