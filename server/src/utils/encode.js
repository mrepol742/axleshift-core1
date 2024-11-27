import crypto from 'crypto'
import { APP_KEY } from '../config.js'

export const encrypt = (text) => {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(APP_KEY), iv)
    let encryptedText = cipher.update(text, 'utf8', 'hex')
    encryptedText += cipher.final('hex')

    const data = { text: encryptedText, iv: iv.toString('hex') }
    return btoa(JSON.stringify(data))
}

export const decrypt = (text) => {
    const parsedData = JSON.parse(atob(text))
    const iv = Buffer.from(parsedData.iv, 'hex')

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(APP_KEY), iv)
    let decryptedText = decipher.update(parsedData.text, 'hex', 'utf8')
    decryptedText += decipher.final('utf8')
    return decryptedText
}
