import React, { useEffect } from 'react'
import { CToaster, CToast, CToastHeader, CToastBody, CImage } from '@coreui/react'
import { useSelector } from 'react-redux'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useToast } from '../components/AppToastProvider'
import { useNotif } from '../components/AppNotificationProvider'
import { parseTimestamp } from '../components/Timestamp'
import Page503 from '../views/errors/503'
import Page500 from '../views/errors/500'

const DefaultLayout = () => {
    const { toasts, addToast } = useToast()
    const { addNotif } = useNotif()
    const maintenance = useSelector((state) => state.maintenance)
    const error = useSelector((state) => state.error)

    useEffect(() => {
        if (!maintenance && !error) {
            addToast('Welcome to core axleshift', 'Hello World')
            addNotif('Welcome to core axleshift')
        }
    }, [])

    return (
        <div>
            {error && <Page500 />}

            {maintenance && !error && <Page503 />}

            {!maintenance && !error && (
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
                                    />
                                    <div className="fw-bold me-auto">{toast.header}</div>
                                    <small>{parseTimestamp(toast.id)}</small>
                                </CToastHeader>
                                <CToastBody>{toast.message}</CToastBody>
                            </CToast>
                        ))}
                    </CToaster>
                </div>
            )}
        </div>
    )
}

export default DefaultLayout
