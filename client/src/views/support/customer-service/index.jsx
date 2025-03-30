import React, { useState, useEffect } from 'react'
import { CCard, CButton, CSpinner } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTooth, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import database from '../../../firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useUserProvider } from '../../../components/UserProvider'
import Inbox from './Inbox'
import MessageBox from './MessageBox'

const Messages = () => {
    const [loading, setLoading] = useState(true)
    const [selectedUser, setselectedUser] = useState(null)
    const [isMobile, setIsMobile] = useState(false)
    const [showPatientList, setShowPatientList] = useState(true)
    const [threadsID, setThreadsID] = useState([])
    const { user } = useUserProvider()
    const messagesRef = collection(database, 'messages')

    useEffect(() => {
        const unsubscribe = onSnapshot(query(messagesRef, orderBy('timestamp')), (snapshot) => {
            const latestMessagesMap = new Map()
            let thread = []

            snapshot.docs.forEach((doc) => {
                const msg = { id: doc.id, ...doc.data() }

                if (!thread.includes(msg.ref)) {
                    latestMessagesMap.set(msg.ref, msg)
                    thread.push(msg.ref)
                }
            })

            // i need coffeeeeeeeeee
            const latestMessagesArray = Array.from(latestMessagesMap.values())
            setThreadsID(latestMessagesArray)
            setLoading(false)
        })

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => {
            window.removeEventListener('resize', checkMobile), unsubscribe()
        }
    }, [])

    const handleSelectUser = (patient) => {
        setselectedUser(patient)

        // const updatedPatients = patients.map((p) =>
        //     p.id === patient.id ? { ...p, unread: false } : p,
        // )
        // setPatients(updatedPatients)

        if (isMobile) {
            setShowPatientList(false)
        }
    }

    const handleBackToList = () => {
        if (isMobile) {
            setShowPatientList(true)
        }
    }

    const handleNewMessage = () => {
        alert('New message button clicked - This would open a new message form')
    }

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    if (!messagesRef)
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: '70vh' }}
            >
                <p>No messages yet</p>
            </div>
        )

    return (
        <div>
            <CCard>
                <div
                    className="d-flex gap-3"
                    style={{
                        height: isMobile ? 'calc(100vh - 180px)' : '75vh',
                        flexDirection: isMobile ? 'column' : 'row',
                    }}
                >
                    {user?.role !== 'patient' && (!isMobile || (isMobile && showPatientList)) && (
                        <Inbox
                            threadsID={threadsID}
                            selectedUser={selectedUser}
                            handleSelectUser={handleSelectUser}
                            isMobile={isMobile}
                        />
                    )}

                    {(user?.role === 'patient' || !isMobile || (isMobile && !showPatientList)) && (
                        <MessageBox
                            messagesRef={messagesRef}
                            selectedUser={
                                selectedUser
                                    ? selectedUser
                                    : user.role === 'user'
                                      ? user
                                      : null
                            }
                            handleBackToList={handleBackToList}
                            isMobile={isMobile}
                            showBackButton={isMobile && user?.role !== 'user'}
                        />
                    )}
                </div>
            </CCard>
        </div>
    )
}

export default Messages
