export const parseTimestamp = (timestamp) => {
    const now = Math.floor(Date.now() / 1000)
    const seconds = Math.floor((Date.now() - timestamp) / 1000)

    if (seconds < 60) return 'now'
    if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60)
        return `${minutes} min`
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600)
        return `${hours} hr`
    } else if (seconds < 2592000) {
        const days = Math.floor(seconds / 86400)
        return `${days} day`
    } else if (seconds < 31536000) {
        const months = Math.floor(seconds / 2592000)
        return `${months} mo`
    }
    const years = Math.floor(seconds / 31536000)
    return `${years} yr`
}
