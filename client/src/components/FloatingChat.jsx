import React, { useState } from 'react'
import Support from '../views/support/customer-service/index'

const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <button className="btn btn-primary" onClick={() => setIsOpen(!isOpen)}>
                Support
            </button>

            {isOpen && (
                <div
                    className="position-fixed bottom-0 translate-middle-y start-50 bg-white shadow rounded p-3"
                    style={{ width: '375px', height: '400px' }}
                >
                    <Support float="true" />
                </div>
            )}
        </div>
    )
}

export default FloatingChat
