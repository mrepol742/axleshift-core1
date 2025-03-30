import React from 'react'
import { CFooter, CContainer } from '@coreui/react'

const Footer = () => {
    return (
        <CFooter>
            <CContainer fluid>
                <p>Axleshift © {new Date().getFullYear()}</p>
            </CContainer>
        </CFooter>
    )
}

export default Footer
