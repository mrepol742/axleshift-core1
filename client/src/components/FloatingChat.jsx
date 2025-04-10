import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments } from '@fortawesome/free-solid-svg-icons'
import Support from '../views/support/customer-service/index'

const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <button className="btn btn-primary" onClick={() => setIsOpen(!isOpen)}>
                <FontAwesomeIcon icon={faComments} className="me-1" /> Support
            </button>

            {isOpen && (
                <div className="position-fixed bottom-0 end-0 mb-5 me-3" style={{ zIndex: 1000 }}>
                    <Support float={true} isOpen={isOpen} />
                </div>
            )}
        </div>
    )
}

export default FloatingChat
