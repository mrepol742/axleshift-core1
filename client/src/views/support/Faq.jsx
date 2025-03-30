import React from 'react'
import { CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody } from '@coreui/react'

const Faq = () => {
    return (
        <div>
            <h1 className="text-center mb-4">Frequently Asked Questions</h1>
            <CAccordion>
                <CAccordionItem itemKey={1}>
                    <CAccordionHeader>What is a Freight Management System?</CAccordionHeader>
                    <CAccordionBody>
                        A Freight Management System (FMS) is a platform that helps businesses manage
                        and optimize their logistics and supply chain operations, including shipment
                        tracking, carrier selection, and cost management.
                    </CAccordionBody>
                </CAccordionItem>
                <CAccordionItem itemKey={2}>
                    <CAccordionHeader>How can I track my shipment?</CAccordionHeader>
                    <CAccordionBody>
                        You can track your shipment using the tracking number provided by the us.
                        Enter the tracking number in the tracking or search section of our Freight
                        Management System to get real-time updates.
                    </CAccordionBody>
                </CAccordionItem>
                <CAccordionItem itemKey={3}>
                    <CAccordionHeader>What services do you offer?</CAccordionHeader>
                    <CAccordionBody>
                        We offer a range of services including freight forwarding, shipment
                        tracking, carrier selection, cost optimization, and supply chain consulting
                        to ensure efficient logistics operations.
                    </CAccordionBody>
                </CAccordionItem>
                <CAccordionItem itemKey={4}>
                    <CAccordionHeader>How do I contact customer support?</CAccordionHeader>
                    <CAccordionBody>
                        You can contact our customer support team via email, phone, or live chat.
                        Visit the &quot;Support&quot; section on our website for more details.
                    </CAccordionBody>
                </CAccordionItem>
                <CAccordionItem itemKey={5}>
                    <CAccordionHeader>What payment methods do you accept?</CAccordionHeader>
                    <CAccordionBody>
                        We accept various payment methods including credit cards, bank transfers,
                        and online payment platforms. Please refer to our payment policy for more
                        information.
                    </CAccordionBody>
                </CAccordionItem>
                <CAccordionItem itemKey={6}>
                    <CAccordionHeader>Can I cancel or modify my shipment?</CAccordionHeader>
                    <CAccordionBody>
                        Yes, you can cancel or modify your shipment 6hrs before it is scheduled to
                        be picked up.
                    </CAccordionBody>
                </CAccordionItem>
                <CAccordionItem itemKey={7}>
                    <CAccordionHeader>Do you provide international shipping?</CAccordionHeader>
                    <CAccordionBody>
                        Yes, we provide international shipping services. Our team ensures that your
                        shipments comply with all customs regulations and reach their destination
                        safely.
                    </CAccordionBody>
                </CAccordionItem>
            </CAccordion>
        </div>
    )
}

export default Faq
