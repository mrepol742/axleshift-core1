import React, { useEffect, useState } from 'react'
import {
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CImage,
    CModal,
    CButton,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useToast } from '../components/AppToastProvider'
import { useModal } from '../components/AppModalProvider'
import { useNotif } from '../components/AppNotificationProvider'
import { useUserProvider } from '../components/UserProvider'
import parseTimestamp from '../utils/Timestamp'
import database from '../firebase'
import { collection, addDoc, onSnapshot, orderBy, query } from 'firebase/firestore'
import FloatingChat from '../components/FloatingChat'

const DefaultLayout = () => {
    const { toasts, addToast } = useToast()
    const { modal, addModal } = useModal()
    const { addNotif } = useNotif()
    const [visibleModals, setVisibleModals] = useState({})
    const { user } = useUserProvider()
    const messagesRef = collection(database, 'messages')
    const [messages, setMessages] = useState([])

    const handleOpen = (id) => {
        setVisibleModals((prev) => ({ ...prev, [id]: true }))
    }

    const handleClose = (id) => {
        setVisibleModals((prev) => ({ ...prev, [id]: false }))
    }

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/notifications')
            response.data.forEach((notif) => addNotif(notif))
        } catch (error) {
            console.error('Error fetching notifications:', error)
        }
    }

    useEffect(() => {
        if (!user._id) return
        fetchNotifications()

        // const unsubscribe = onSnapshot(query(messagesRef, orderBy('timestamp')), (snapshot) => {
        //     const msgs = snapshot.docs
        //         .map((doc) => ({ id: doc.id, ...doc.data() }))
        //         .filter((msg) => msg.ref === user._id)
        //     setMessages(msgs)
        // })
        // return () => unsubscribe()
    }, [user])

    return (
        <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <AppContent />
                </div>
                <AppFooter />
            </div>

            <CToaster className="position-fixed top-0 end-0 p-3">
                {toasts.map((toast) => (
                    <CToast key={toast.id} autohide={true} visible={true}>
                        <CToastHeader closeButton>
                            <CImage
                                className="rounded me-2"
                                src="/favicon.ico"
                                width="20"
                                loading="lazy"
                            />
                            <div className="fw-bold me-auto">{toast.header}</div>
                            <small>{parseTimestamp(toast.id)}</small>
                        </CToastHeader>
                        <CToastBody>{toast.message}</CToastBody>
                    </CToast>
                ))}
            </CToaster>
            <div
                className="position-fixed top-50 start-50 translate-middle p-3"
                style={{ zIndex: 1050 }}
            >
                {modal.map((_modal) => (
                    <div key={_modal.id}>
                        <CModal
                            alignment="center"
                            scrollable
                            visible={visibleModals[_modal.id] || true}
                            onClose={() => handleClose(_modal.id)}
                            aria-labelledby={_modal.id}
                        >
                            <CModalHeader>
                                <CModalTitle id={_modal.id}>{_modal.header}</CModalTitle>
                            </CModalHeader>
                            <CModalBody>{_modal.body}</CModalBody>
                            <CModalFooter>
                                <CButton color="primary" onClick={(e) => handleClose(_modal.id)}>
                                    {_modal.primaryButton[0].title}
                                </CButton>
                            </CModalFooter>
                        </CModal>
                    </div>
                ))}
            </div>
            {user.role === 'user' && (
                <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 2050 }}>
                    <FloatingChat />
                </div>
            )}
        </div>
    )
}

export default DefaultLayout
