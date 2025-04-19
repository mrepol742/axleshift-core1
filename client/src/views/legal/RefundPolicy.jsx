import React from 'react'
import { CCol, CContainer, CRow } from '@coreui/react'

const RefundPolicy = () => {
    return (
        <div>
            <h1 className="display-4 text-primary fw-medium">Refund Policy</h1>
            <p className="text-muted">
                At Axleshift, we aim to deliver reliable and transparent freight services to all our
                clients. Please read our refund policy carefully to understand your rights and our
                obligations regarding cancellations and refunds.
                <br />
                Last Updated: Sat, April 19 2025
            </p>
            <div className="mb-3">
                <h3>Eligibility for Refunds</h3>
                <div className="ms-3">
                    <h5>Refunds may be issued only under the following circumstances:</h5>
                    <ul>
                        <li>
                            If a shipment booking is canceled <strong>before</strong> the shipment
                            is handed over to the assigned courier.
                        </li>
                        <li>In the event of duplicate payment due to a technical error.</li>
                        <li>
                            If an error on our part prevents the shipment from being picked up or
                            delivered as scheduled.
                        </li>
                    </ul>
                </div>
            </div>
            <div className="mb-3">
                <h3>Non - Refundable Situations</h3>
                <ul>
                    <li>
                        Once the shipment is in the <strong>hands of the courier</strong> or has
                        been marked as <strong>in transit</strong>.
                    </li>
                    <li>
                        Delays or disruptions caused by unforeseen events such as weather, customs
                        issues, or incorrect shipping details provided by the customer.
                    </li>
                    <li>
                        Shipment rejected due to non - compliance with regulations, improper
                        packaging, or restricted items.
                    </li>
                </ul>
            </div>
            <div className="mb-3">
                <h3>How to Request a Refund</h3>
                <p>
                    To request a refund, please contact our support team at{' '}
                    <strong>axleshift@gmail.com</strong> with the following details:
                </p>
                <ul>
                    <li>Booking Reference Number</li>
                    <li>Reason for Refund</li>
                    <li>Proof of Payment (if applicable)</li>
                    <li>Any supporting documents</li>
                </ul>
                <p>
                    All refund requests must be submitted within <strong>30 days</strong> of the
                    booking date. Refund processing may take up to <strong>7 business days</strong>{' '}
                    after approval.
                </p>
            </div>
            <div className="mb-3">
                <h3>Refund Method</h3>
                <p>
                    Approved refunds will be processed using the original payment method unless
                    otherwise specified. In cases where this is not possible, alternative
                    arrangements will be made with the customer.
                </p>
            </div>
            <div className="mb-3">
                <h3>Changes to This Policy</h3>
                <p>
                    We reserve the right to update or modify this Refund Policy at any time without
                    prior notice. Changes will be posted on our website and will take effect
                    immediately upon publication.
                </p>
            </div>
            <div className="mb-3">
                <h3>Contact Information</h3>
                <p>
                    For any questions about this Refund Policy, please contact us at{' '}
                    <strong>axleshift@gmail.com</strong>.
                </p>
            </div>
        </div>
    )
}

export default RefundPolicy
