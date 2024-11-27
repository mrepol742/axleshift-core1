// just to make sure
const generateUUID = () => {
    const array = new Uint8Array(16)
    window.crypto.getRandomValues(array)
    array[6] = (array[6] & 0x0f) | 0x40
    // Set the 8th byte (variant) to 8, 9, A, or B
    array[8] = (array[8] & 0x3f) | 0x80

    const uuid = array.reduce((str, byte, index) => {
        if (index === 4 || index === 6 || index === 8 || index === 10) {
            str += '-'
        }
        str += byte.toString(16).padStart(2, '0')
        return str
    }, '')

    return uuid
}

export default generateUUID
