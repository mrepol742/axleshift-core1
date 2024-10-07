import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
    return (
        <CFooter className="px-4">
            <div>
                Freight Core 1<span className="ms-1">&copy; 2024</span>
            </div>
            <div className="ms-auto">
                <a
                    href="https://stats.uptimerobot.com/5l58Mua0Wi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                >
                    System Status
                </a>
            </div>
        </CFooter>
    )
}

export default React.memo(AppFooter)
