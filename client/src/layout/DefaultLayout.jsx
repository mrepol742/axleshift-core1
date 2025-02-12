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
import parseTimestamp from '../utils/Timestamp'

const DefaultLayout = () => {
    const { toasts, addToast } = useToast()
    const { modal, addModal } = useModal()
    const { addNotif } = useNotif()
    const [visibleModals, setVisibleModals] = useState({})

    const handleOpen = (id) => {
        setVisibleModals((prev) => ({ ...prev, [id]: true }))
    }

    const handleClose = (id) => {
        setVisibleModals((prev) => ({ ...prev, [id]: false }))
    }

    useEffect(() => {
        addToast('Welcome to axleshift', 'Hello World')
        addNotif('Welcome to core 1 axleshift')
    }, [])

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
        </div>
    )
}

export default DefaultLayout
