import React from 'react'
import { CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody } from '@coreui/react'

const Faq = () => {
    return (
        <CAccordion>
            <CAccordionItem itemKey={1}>
                <CAccordionHeader>What is a Freight Management System?</CAccordionHeader>
                <CAccordionBody>
                    A Freight Management System (FMS) is a platform that helps businesses manage and
                    optimize their logistics and supply chain operations, including shipment
                    tracking, carrier selection, and cost management.
                </CAccordionBody>
            </CAccordionItem>
            <CAccordionItem itemKey={2}>
                <CAccordionHeader>How can I track my shipment?</CAccordionHeader>
                <CAccordionBody>
                    You can track your shipment using the tracking number provided by the us. Enter
                    the tracking number in the tracking or search section of our Freight Management
                    System to get real-time updates.
                </CAccordionBody>
            </CAccordionItem>
            <CAccordionItem itemKey={3}>
                <CAccordionHeader>What services do you offer?</CAccordionHeader>
                <CAccordionBody>
                    We offer a range of services including freight forwarding, shipment tracking,
                    carrier selection, cost optimization, and supply chain consulting to ensure
                    efficient logistics operations.
                </CAccordionBody>
            </CAccordionItem>
        </CAccordion>
    )
}

export default Faq
