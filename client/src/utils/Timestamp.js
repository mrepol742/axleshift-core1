const parseTimestamp = (timestamp) => {
    const localTimestamp = new Date(timestamp).getTime()
    const now = Date.now()
    const seconds = Math.floor((now - localTimestamp) / 1000)

    if (seconds < 60) return 'now'
    if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60)
        return `${minutes} min`
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600)
        return `${hours} hr`
    } else if (seconds < 2592000) {
        const days = Math.floor(seconds / 86400)
        if (days > 1) return `${days} days`
        return `${days} day`
    } else if (seconds < 31536000) {
        const months = Math.floor(seconds / 2592000)
        return `${months} mo`
    }
    const years = Math.floor(seconds / 31536000)
    if (years > 1) return `${years} yrs`
    return `${years} yr`
}

export default parseTimestamp
