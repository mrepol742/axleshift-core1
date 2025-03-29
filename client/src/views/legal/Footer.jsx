import React from 'react'
import { CFooter, CContainer } from '@coreui/react'

const Footer = () => {
    return (
        <CFooter>
            <CContainer fluid>
                <p>Axleshift Core 1 © {new Date().getFullYear()}</p>
            </CContainer>
        </CFooter>
    )
}

export default Footer
