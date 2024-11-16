import React from 'react'

const Search = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const url = urlParams.get('q') ? urlParams.get('q') : '/'

    return ''
}

export default Search
