import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CSpinner, CListGroup, CListGroupItem } from '@coreui/react'
import database from '../../../firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

import { useUserProvider } from '../../../components/UserProvider'
import parseTimestamp from '../../../utils/Timestamp'

const Inbox = () => {
    const { user } = useUserProvider()
    const navigate = useNavigate()
    const [threadsID, setThreadsID] = useState([])
    const [loading, setLoading] = useState(false)
    const messagesRef = collection(database, 'messages')

    const fetchData = () => {
        const isAdmin = ['super_admin', 'admin', 'staff'].includes(user.role)
        if (!isAdmin) navigate(`/customer/${user.ref}`)

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
        })
        return () => unsubscribe()
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    return (
        <div>
            {['super_admin', 'admin', 'staff'].includes(user.role) && (
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
                                <small>
                                    {thread.sender === 'admin' || thread.sender === 'super_admin'
                                        ? 'You'
                                        : 'Client'}
                                </small>
                            </CListGroupItem>
                        ))}
                    </CListGroup>
                </div>
            )}
        </div>
    )
}

export default Inbox
