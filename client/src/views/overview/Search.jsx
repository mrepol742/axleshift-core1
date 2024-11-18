import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Search = () => {
    const navigate = useNavigate()
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('q') ? urlParams.get('q') : ''

    return (
        <div className="d-flex flex-row justify-content-center">
            There is nothing here in the moment, still working on it...
        </div>
    )
}

export default Search
