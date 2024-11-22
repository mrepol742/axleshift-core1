import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CForm, CFormSelect } from '@coreui/react'

const Search = () => {
    const navigate = useNavigate()
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('q') ? urlParams.get('q') : ''

    return (
        <div>
            <CForm className="d-block d-sm-flex justify-content-left my-2 my-lg-0">
                <CFormSelect
                    options={[
                        { label: 'Select status', value: '0' },
                        { label: 'On Route', value: '1' },
                        { label: 'Canceled', value: '2' },
                        { label: 'Shipped', value: '3' },
                    ]}
                    className="mb-3"
                />
                <div className="mx-2"></div>
                <CFormSelect
                    options={[
                        { label: 'Newer', value: '1' },
                        { label: 'Older', value: '2' },
                    ]}
                    className="mb-3"
                />
                <div className="mx-2"></div>
                <CFormSelect
                    options={[
                        { label: 'Freight type', value: '1' },
                        { label: 'Sea Freight', value: '2' },
                        { label: 'Land Freight', value: '3' },
                        { label: 'Air Freight', value: '4' },
                    ]}
                    className="mb-3"
                />
            </CForm>
            <div className="d-flex flex-row justify-content-center">
                There is nothing here in the moment, still working on it...
            </div>
        </div>
    )
}

export default Search
