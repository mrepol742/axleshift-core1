import React, { useState, useEffect } from 'react'
import { Button, InputGroup, FormControl, OverlayTrigger, Popover } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPlusCircle, faArrowLeft, faTooth } from '@fortawesome/free-solid-svg-icons'
import { addDoc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import parseTimestamp from '../../../utils/Timestamp'

const MessageBox = ({ messagesRef, selectedUser, handleBackToList, isMobile, showBackButton }) => {
    const [messagesNew, setMessagesNew] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [showPresets, setShowPresets] = useState(false)
    const messageA = React.useRef(null)
    const user = useSelector((state) => state.user)

    useEffect(() => {
        if (!selectedUser) return
        const unsubscribe = onSnapshot(query(messagesRef, orderBy('timestamp')), (snapshot) => {
            const msgs = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((msg) => msg.sender_id === selectedUser.id)
            setMessagesNew(msgs)
        })
        return () => unsubscribe()
    }, [selectedUser])

    useEffect(() => {
        if (messageA.current) messageA.current.scrollIntoView({ behavior: 'smooth' })
    }, [messagesNew, selectedUser])

    const presetMessages = [
        'When will my shipment be dispatched?',
        'What documents are required for customs clearance?',
        'Can you confirm the estimated arrival date of my freight?',
        'How can I update the delivery address or contact details?',
        'Are there any special handling instructions I should be aware of?',
        'How do I schedule a pickup for my next shipment?',
        'What are the charges for expedited shipping?',
        'Can I track my shipment in real-time?',
        'What should I do if my shipment is delayed?',
        'Are there any restrictions on the type of goods I can ship?',
        'How do I file a claim for a damaged shipment?',
        'What are the weight and size limits for freight shipments?',
        'Can I request a specific delivery time for my shipment?',
        'What payment methods do you accept for freight services?',
        'How do I cancel or reschedule a shipment?',
    ]

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '' && selectedUser) {
            await addDoc(messagesRef, {
                message: newMessage,
                role: user.role,
                timestamp: Date.now(),
                sender_id: selectedUser.id,
            })
            setNewMessage('')
        }
    }

    const handleSelectPreset = (preset) => {
        setNewMessage(preset)
        setShowPresets(false)
    }

    const presetsPopover = (
        <Popover id="popover-basic" style={{ maxWidth: '300px' }}>
            <Popover.Header as="h3">Quick Messages</Popover.Header>
            <Popover.Body>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {presetMessages.map((message, index) => (
                        <div
                            key={index}
                            className="p-2 mb-1 border-bottom"
                            style={{
                                cursor: 'pointer',
                            }}
                            onClick={() => handleSelectPreset(message)}
                        >
                            {message}
                        </div>
                    ))}
                </div>
            </Popover.Body>
        </Popover>
    )

    const role = (msg) => {
        return msg.role === user.role
    }

    return (
        <div
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderTopRightRadius: isMobile ? '0' : '12px',
                borderBottomRightRadius: isMobile ? '0' : '12px',
                borderBottomLeftRadius: isMobile ? '12px' : '0',
                height: isMobile ? '100%' : 'auto',
            }}
        >
            {selectedUser ? (
                <div
                className="d-flex flex-column justify-content-between h-100"
                 
                >
                    <div className="d-flex align-items-center p-2 bg-secondary rounded-top">
                        {showBackButton && (
                            <Button
                                variant="link"
                                onClick={handleBackToList}
                                style={{
                                    color: '#2d4739',
                                    padding: '0 10px 0 0',
                                }}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Button>
                        )}
                        <div
                            className="bg-primary fw-bold rounded-pill me-2 d-flex justify-content-center align-items-center text-white"
                            style={{
                                width: '40px',
                                height: '40px',
                            }}
                        >
                            {selectedUser.id.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                            <h4
                                style={{
                                    margin: 0,
                                    fontSize: isMobile ? '16px' : '18px',
                                }}
                            >
                                {selectedUser.id.slice(0, 6).toUpperCase()}
                            </h4>
                            <div
                                className="text-muted"
                                style={{
                                    fontSize: '13px',
                                }}
                            >
                                {selectedUser.id}
                            </div>
                        </div>
                    </div>

                    <div
                        className="d-flex flex-grow-1 border-start border-end"
                        style={{
                            overflowY: 'auto',
                            padding: '15px 10px',
                        }}
                    >
                        {messagesNew.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    textAlign: role(msg) ? 'right' : 'left',
                                    marginBottom: '12px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'inline-block',
                                        padding: '10px 14px',
                                        borderRadius: '12px',
                                        backgroundColor: role(msg) ? '#4285f4' : '#fff',
                                        border: role(msg) ? 'none' : '1px solid #4285f4',
                                        maxWidth: isMobile ? '85%' : '80%',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                        color: '#2d4739',
                                        position: 'relative',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {/* {msg.type === 'appointment' && (
                                        <div
                                            style={{
                                                backgroundColor: '#55785E',
                                                color: 'white',
                                                padding: '1px 6px',
                                                borderRadius: '6px',
                                                fontSize: '11px',
                                                marginBottom: '6px',
                                                display: 'inline-block',
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faCalendarAlt}
                                                className="me-1"
                                            />
                                            APPOINTMENT
                                        </div>
                                    )}
                                    {msg.type === 'confirmation' && (
                                        <div
                                            style={{
                                                backgroundColor: '#55785E',
                                                color: 'white',
                                                padding: '1px 6px',
                                                borderRadius: '6px',
                                                fontSize: '11px',
                                                marginBottom: '6px',
                                                display: 'inline-block',
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faBell} className="me-1" />
                                            CONFIRMATION
                                        </div>
                                    )} */}
                                    <div style={{ fontSize: isMobile ? '13px' : '14px' }}>
                                        {JSON.stringify(msg)}
                                        {msg.message}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        fontSize: '11px',
                                        color: 'gray',
                                        marginTop: '4px',
                                        textAlign: role(msg) ? 'right' : 'left',
                                        paddingLeft: role(msg) ? '0' : '12px',
                                        paddingRight: role(msg) ? '12px' : '0',
                                    }}
                                >
                                    {parseTimestamp(msg.timestamp)}
                                </div>
                            </div>
                        ))}
                        <div ref={messageA} />
                    </div>

                    <div className="mt-2" style={{ borderTop: '1px solid #f0f0f0' }}>
                        <InputGroup className="mt-2">
                            <FormControl
                                as="textarea"
                                placeholder="Type message..."
                                value={newMessage}
                                className="border-primary border-2"
                                onChange={(e) => setNewMessage(e.target.value)}
                                style={{
                                    padding: '10px',
                                    resize: 'none',
                                    minHeight: '45px',
                                    maxHeight: isMobile ? '45px' : '45px',
                                    overflowY: 'auto',
                                    fontSize: '12px',
                                }}
                            />

                            <OverlayTrigger
                                trigger="click"
                                placement="top"
                                overlay={presetsPopover}
                                rootClose
                            >
                                <Button
                                    style={{
                                        height: isMobile ? '45px' : '45px',
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlusCircle} />
                                </Button>
                            </OverlayTrigger>

                            <Button
                                style={{
                                    height: isMobile ? '45px' : '45px',
                                }}
                                onClick={handleSendMessage}
                            >
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </Button>
                        </InputGroup>
                    </div>
                </div>
            ) : (
                <div className="d-flex justify-content-center align-items-center h-100 flex-column">
                    <div
                        style={{
                            width: '70px',
                            height: '70px',
                            backgroundColor: '#e0f19c80',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '15px',
                            border: '1px solid #c2d68a',
                        }}
                    >
                        <FontAwesomeIcon icon={faTooth} size="2x" style={{ color: '#55785E' }} />
                    </div>
                    <p style={{ color: '#55785E', fontSize: '16px' }}>
                        Select a user to view conversation
                    </p>
                </div>
            )}
        </div>
    )
}

export default MessageBox
