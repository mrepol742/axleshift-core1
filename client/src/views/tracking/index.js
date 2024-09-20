import React, { useEffect, useState } from 'react'
import { CInputGroup, CFormInput, CInputGroupText, CForm } from '@coreui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const Tracking = () => {
    const [trackingID, setTrackingID] = useState('')

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const q = params.get('q')
        if (q) {
            setTrackingID(q)
        }
    }, [])

    return (
        <>
            {!trackingID && (
                <>
                    <h1>Enter Tracking ID</h1>
                    <CForm method="get">
                        <CInputGroup className="mb-3">
                            <CFormInput
                                aria-label="tracking id"
                                aria-describedby="basic-addon"
                                name="q"
                            />
                            <CInputGroupText id="basic-addon" type="submit">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </CInputGroupText>
                        </CInputGroup>
                    </CForm>
                </>
            )}
            {trackingID && <p>The tracking ID: {trackingID}</p>}
        </>
    )
}

export default Tracking
