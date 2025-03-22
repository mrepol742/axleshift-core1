import React, { useState } from 'react'
import {
    CFooter,
    CNav,
    CNavItem,
    CNavLink,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CButton,
} from '@coreui/react'

const AppFooter = () => {
    const [modal, setModal] = useState(false)

    const toggleModal = () => {
        setModal(!modal)
    }

    return (
        <>
            <CFooter className="small">
                <CNav className="justify-content-center">
                    <CNavItem>
                        <CNavLink href="/privacy-policy" className="px-2 text-body-secondary">
                            &copy; {new Date().getFullYear()} Axleshift Core 1
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink href="/privacy-policy" className="px-2 text-body-secondary">
                            Privacy
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink href="/terms-of-service" className="px-2 text-body-secondary">
                            Terms
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            href="https://stats.uptimerobot.com/5l58Mua0Wi"
                            className="px-2 text-body-secondary"
                        >
                            Status
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            href="#"
                            className="px-2 text-body-secondary"
                            onClick={toggleModal}
                        >
                            Cookies
                        </CNavLink>
                    </CNavItem>
                </CNav>
            </CFooter>

            <CModal alignment="center" visible={modal} onClose={toggleModal}>
                <CModalHeader onClose={toggleModal}>Cookies Policy</CModalHeader>
                <CModalBody>
                    Cookies are small text files placed on your device to store data so web servers
                    can use it later. Axleshfit and our third-party partners use cookies to remember
                    your preferences and settings, help you sign in, and analyze how well our
                    websites are working.
                    <br />
                    <br />
                    <strong>Required Cookies:</strong>
                    <br /> These cookies are essential for the website to function and cannot be
                    switched off in our systems. They are usually only set in response to actions
                    made by you which amount to a request for services, such as setting your privacy
                    preferences, logging in, or filling in forms. You can set your browser to block
                    or alert you about these cookies, but some parts of the site will not then work.
                    These cookies do not store any personally identifiable information.
                </CModalBody>
            </CModal>
        </>
    )
}

export default React.memo(AppFooter)
