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
    CModalTitle,
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

            <CModal
                backdrop="static"
                alignment="center"
                visible={modal}
                scrollable
                onClose={toggleModal}
                aria-labelledby="cookies-policy"
            >
                <CModalHeader onClose={toggleModal}>
                    <CModalTitle id="cookies-policy">Cookies Policy</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <strong>What is cookies?</strong>
                    <p>
                        Cookies are small text files placed on your device to store data so web
                        servers can use it later. Axleshfit and our third-party partners use cookies
                        to remember your preferences and settings, help you sign in, and analyze how
                        well our websites are working.
                    </p>
                    <strong>Required Cookies</strong>
                    <p>
                        These cookies are essential for the website to function and cannot be
                        switched off in our systems. They are usually only set in response to
                        actions made by you which amount to a request for services, such as setting
                        your privacy preferences, logging in, or filling in forms. You can set your
                        browser to block or alert you about these cookies, but some parts of the
                        site will not then work. These cookies do not store any personally
                        identifiable information.
                    </p>
                    <strong>Performance Cookies</strong>
                    <p>
                        These cookies allow us to count visits and traffic sources so we can measure
                        and improve the performance of our site. They help us to know which pages
                        are the most and least popular and see how visitors move around the site.
                        All information these cookies collect is aggregated and therefore anonymous.
                        If you do not allow these cookies we will not know when you have visited our
                        site, and will not be able to monitor its performance.
                    </p>
                </CModalBody>
            </CModal>
        </>
    )
}

export default React.memo(AppFooter)
