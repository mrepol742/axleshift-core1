import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Search = () => {
    const navigate = useNavigate()
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('q') ? urlParams.get('q') : ''

    useEffect(() => {
        if (/^[a-fA-F0-9]{24}$/.test(query)) navigate(`/track/${query}`)
    }, [])

    return ''
}

export default Search
