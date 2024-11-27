import React, { useEffect } from 'react'
import { CToaster, CToast, CToastHeader, CToastBody, CImage } from '@coreui/react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useToast } from '../components/AppToastProvider'
import { useNotif } from '../components/AppNotificationProvider'
import parseTimestamp from '../utils/Timestamp'

const DefaultLayout = () => {
    const { toasts, addToast } = useToast()
    const { addNotif } = useNotif()

    useEffect(() => {
        addToast('Welcome to core 1 axleshift', 'Hello World')
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
        </div>
    )
}

export default DefaultLayout
