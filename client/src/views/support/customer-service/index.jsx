import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CSpinner, CListGroup, CListGroupItem } from '@coreui/react'
import database from '../../../firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

import { useUserProvider } from '../../../components/UserProvider'
import { parseTimestamp } from '../../../components/Timestamp'

const Inbox = () => {
    const { user } = useUserProvider()
    const navigate = useNavigate()
    const [threadsID, setThreadsID] = useState([])
    const [loading, setLoading] = useState(true)
    const messagesRef = collection(database, 'messages')

    useEffect(() => {
        if (user.role !== 'admin') return ''
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
        return () => unsubscribe()
    }, [])

    return (
        <>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}

            {user.role !== 'admin' && navigate(`/customer/${user.ref}`)}

            {user.role === 'admin' && (
                <div className="row d-flex justify-content-center mx-0 mb-4">
                    <CListGroup>
                        {threadsID.map((thread, index) => (
                            <CListGroupItem
                                as="a"
                                key={index}
                                onClick={() => navigate(`/customer/${thread.ref}`)}
                            >
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">#{thread.ref}</h5>
                                    <small>{parseTimestamp(thread.timestamp)}</small>
                                </div>
                                <p className="mb-1">{thread.text}</p>
                                <small>{thread.sender === 'admin' ? 'You' : 'Client'}</small>
                            </CListGroupItem>
                        ))}
                    </CListGroup>
                </div>
            )}
        </>
    )
}

export default Inbox
