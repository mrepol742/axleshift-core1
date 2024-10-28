import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    CCard,
    CCardBody,
    CImage,
    CFormInput,
    CButton,
    CFormTextarea,
    CSpinner,
    CListGroup,
    CListGroupItem,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import database from '../../../firebase'
import { collection, addDoc, onSnapshot, orderBy, query } from 'firebase/firestore'

import Profile, { isAdmin } from '../../../components/Profile'
import { parseTimestamp } from '../../../components/Timestamp'

const Chat = () => {
    const user = Profile()
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const endOfMessagesRef = useRef(null)
    const [rows, setRows] = useState(1)
    const messagesRef = collection(database, 'messages')
    const { id } = useParams()

    useEffect(() => {
        let customer_service_ref = id
        // if (isAdmin()) loadMessages(id)

        const unsubscribe = onSnapshot(query(messagesRef, orderBy('timestamp')), (snapshot) => {
            const msgs = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((msg) => msg.customer_service_ref === customer_service_ref)
            setMessages(msgs)
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (endOfMessagesRef.current)
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleKeyDown = (event) => {
        if (event.key !== 'Enter') return
        if (event.shiftKey) {
            setMessage((prev) => prev + '\n')
            setRows((prevRows) => Math.min(prevRows + 1, 4))
            event.preventDefault()
            return
        }
        sendMessage()
        event.preventDefault()
    }

    const sendMessage = async () => {
        if (message.trim() === '') return
        await addDoc(messagesRef, {
            text: message,
            sender: user.role,
            timestamp: Date.now(),
            customer_service_ref: user.customer_service_ref,
        })
        setMessage('')
        setRows(1)
    }

    const handleTextAreaChange = (event) => {
        const value = event.target.value
        setMessage(value)

        // holy god i honeslty i dont know what im eben doin
        // as long as it works IT IS
        const newRowCount = Math.max(1, (value.match(/\n/g) || []).length + 1)
        setRows(Math.min(newRowCount, 4))
    }

    const renderMessage = (msg) => {
        return msg.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                {index < msg.split('\n').length - 1 && <br />}
            </span>
        ))
    }

    return (
        <div className="row d-flex justify-content-center mx-0 mb-4">
            <CCard style={{ height: '78vh', overflow: 'hidden', padding: '0px' }}>
                <CCardBody
                    style={{
                        position: 'relative',
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`d-flex flex-row ${message.sender === (user.role === 'user' ? 'admin' : 'user') ? 'justify-content-start' : 'justify-content-end'}`}
                        >
                            {message.sender === (user.role === 'admin' ? 'user' : 'admin') && (
                                <CImage
                                    className="rounded-5 me-2"
                                    src="https://avatars.githubusercontent.com/u/62317165?v=4"
                                    style={{ width: '45px', height: '100%' }}
                                />
                            )}
                            <div>
                                <p
                                    className={`small p-2 mb-1 rounded ${
                                        message.sender !== (user.role === 'user' ? 'user' : 'admin')
                                            ? 'bg-primary text-white me-3'
                                            : 'bg-body-tertiary ms-3'
                                    }`}
                                >
                                    {renderMessage(message.text)}
                                </p>
                                <p
                                    className={`small ms-3 mb-3 text-muted ${message.sender === (user.role === 'user' ? 'user' : 'admin') ? 'me-3' : ''}`}
                                >
                                    {parseTimestamp(message.timestamp)}
                                </p>
                            </div>
                            {message.sender === (user.role === 'user' ? 'user' : 'admin') && (
                                <CImage
                                    className="rounded-5 ms-2"
                                    src="https://avatars.githubusercontent.com/u/62317165?v=4"
                                    style={{ width: '45px', height: '100%' }}
                                />
                            )}
                        </div>
                    ))}
                    <div ref={endOfMessagesRef} />
                </CCardBody>
                <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3 gap-2">
                    <div>
                        <CImage
                            className="me-2 rounded-5"
                            src="https://avatars.githubusercontent.com/u/62317165?v=4"
                            style={{ width: '40px', height: '100%' }}
                        />
                    </div>

                    <CFormTextarea
                        value={message}
                        onChange={(e) => handleTextAreaChange(e)}
                        onKeyDown={handleKeyDown}
                        rows={rows}
                        style={{ resize: 'none' }}
                    />

                    <CButton
                        type="submit"
                        color="primary"
                        className="me-2 rounded"
                        onClick={sendMessage}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </CButton>
                </div>
            </CCard>
        </div>
    )
}

export default Chat
