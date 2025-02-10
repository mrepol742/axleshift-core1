import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
    return (
        <CFooter className="px-4">
            <div>Axleshift Core 1 © {new Date().getFullYear()}</div>
            <div className="ms-auto"></div>
        </CFooter>
    )
}

export default React.memo(AppFooter)
