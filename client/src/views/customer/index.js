import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CImage, CFormInput, CButton } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
//import '../../firebase'

const Customer = () => {
    const messages = [
        {
            profile: 'https://avatars.githubusercontent.com/u/62317165?v=4',
            text: 'Hello!',
            sender: 'user',
            date: 22,
        },
        {
            profile: 'https://avatars.githubusercontent.com/u/62317165?v=4',
            text: 'H=eeekfu?',
            sender: 'admin',
            date: 22,
        },
        {
            profile: 'https://avatars.githubusercontent.com/u/62317165?v=4',
            text: 'hello woprld',
            sender: 'user',
            date: 22,
        },
        {
            profile: 'https://avatars.githubusercontent.com/u/62317165?v=4',
            text: 'unepcted error at line20!',
            sender: 'user',
            date: 22,
        },
    ]

    return (
        <>
            <div>
                <div className="row d-flex justify-content-center">
                    <div>
                        <CCard style={{ height: '100vh', overflow: 'hidden' }}>
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
                                        className={`d-flex flex-row mb-4 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                                    >
                                        {message.sender === 'admin' && (
                                            <CImage
                                                className="rounded-5"
                                                src={`${message.profile}`}
                                                style={{ width: '45px', height: '100%' }}
                                            />
                                        )}
                                        <div>
                                            <p
                                                className={`small p-2 mb-1 rounded-3 ${
                                                    message.sender === 'user'
                                                        ? 'bg-primary text-white me-3'
                                                        : 'bg-body-tertiary ms-3'
                                                }`}
                                            >
                                                {message.text}
                                            </p>
                                            <p
                                                className={`small ms-3 mb-3 text-muted ${message.sender === 'user' ? 'me-3' : ''}`}
                                            >
                                                00:0{index + 6}
                                            </p>
                                        </div>
                                        {message.sender === 'user' && (
                                            <CImage
                                                className="rounded-5"
                                                src={`${message.profile}`}
                                                style={{ width: '45px', height: '100%' }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </CCardBody>
                            <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3 gap-2">
                                <CImage
                                    className="rounded-5"
                                    src="https://avatars.githubusercontent.com/u/62317165?v=4"
                                    style={{ width: '40px', height: '100%' }}
                                />
                                <CFormInput type="text" placeholder="Type message" />
                                <CButton type="submit" color="primary" className="me-2 rounded">
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </CButton>
                            </div>
                        </CCard>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Customer
