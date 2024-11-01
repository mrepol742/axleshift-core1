import fs from 'fs'
import path from 'path'

const filePath = path.resolve(import.meta.dirname, '../../.gemini.json')
let authKeys = JSON.parse(fs.readFileSync(filePath, 'utf8'))

export const getApikey = () => {
    const currentTime = Date.now()
    const oneMinuteAgo = currentTime - 60 * 1000

    for (const key of Object.keys(authKeys)) {
        const value = authKeys[key]
        if (
            value.request <= 10 &&
            (value.last_accessed === null || value.last_accessed < oneMinuteAgo)
        ) {
            value.request += 1
            value.last_accessed = currentTime
            return value.key
        }
    }
}
