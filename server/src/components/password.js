import crypto from 'crypto'

const hash = (password) => {
    return crypto.createHash('sha256').update(`!_${password}%%`).digest('hex')
}

export const generateUniqueId = () => {
    return crypto.randomUUID()
}

export default hash
