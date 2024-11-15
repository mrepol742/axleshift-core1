import React from 'react'
import { CToaster, CToast, CToastHeader, CToastBody, CImage } from '@coreui/react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useToast } from '../components/ToastContext'
import { parseTimestamp } from '../components/Timestamp'

const DefaultLayout = () => {
    const { toasts, addToast } = useToast()

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
                    <CToast key={toast.id} autohide={false} visible={true}>
                        <CToastHeader closeButton>
                            <CImage className="rounded me-2" src="/favicon.ico" width="20" />
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
