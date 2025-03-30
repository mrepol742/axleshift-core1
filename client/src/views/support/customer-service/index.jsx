import React, { useState, useEffect } from 'react'
import { CCard, CSpinner } from '@coreui/react'
import PropTypes from 'prop-types'
import database from '../../../firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useUserProvider } from '../../../components/UserProvider'
import Inbox from './Inbox'
import MessageBox from './MessageBox'

const Messages = ({ float }) => {
    const [loading, setLoading] = useState(true)
    const [selectedUser, setselectedUser] = useState(null)
    const [isMobile, setIsMobile] = useState(false)
    const [showUserList, setshowUserList] = useState(true)
    const [threadsID, setThreadsID] = useState([])
    const { user } = useUserProvider()
    const messagesRef = collection(database, 'messages')

    useEffect(() => {
        if (!user._id) return
        if (user && !selectedUser && float) setselectedUser({ id: user._id })
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
    }, [user])

    const handleSelectUser = (patient) => {
        setselectedUser(patient)
        if (isMobile) {
            setshowUserList(false)
        }
    }

    const handleBackToList = () => {
        if (isMobile) {
            setshowUserList(true)
        }
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
        <div className="mb-3">
            <CCard>
                <div
                    className="d-flex"
                    style={{
                        height: isMobile ? 'calc(100vh - 180px)' : '75vh',
                        flexDirection: isMobile ? 'column' : 'row',
                    }}
                >
                    {user?.role !== 'user' &&
                        (!isMobile || (isMobile && showUserList)) &&
                        !float && (
                            <Inbox
                                threadsID={threadsID}
                                selectedUser={selectedUser}
                                handleSelectUser={handleSelectUser}
                                isMobile={isMobile}
                            />
                        )}

                    {(user?.role === 'user' || !isMobile || (isMobile && !showUserList)) && (
                        <MessageBox
                            messagesRef={messagesRef}
                            selectedUser={
                                selectedUser ? selectedUser : user.role === 'user' ? user : null
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

Messages.propTypes = {
    float: PropTypes.bool,
}
