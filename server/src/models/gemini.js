import { GoogleGenerativeAI } from '@google/generative-ai'
import { GEMINI_MODEL } from '../config.js'
import { getApiKey, moveApikey } from '../components/apikey.js'
import logger from '../components/logger.js'

const gemini = async (prompt, json, retry) => {
    try {
        const genAI = new GoogleGenerativeAI(getApiKey())
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })
        const result = await model.generateContent(prompt)
        const res = result.response.text()
        return json ? JSON.parse(res) : res
    } catch (err) {
        logger.error(err)
        if (retry) return null
        if (error.code === '429') moveApikey()
        return gemini(prompt, json, true)
    }
    return null
}

export default gemini
