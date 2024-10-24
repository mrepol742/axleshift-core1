import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios'
import logger from '../components/logger.js'

const recaptcha = async (req, res, next) => {
    const { recaptcha_ref } = req.body
    if (!recaptcha_ref) return res.status(400).send()

    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET,
                response: recaptcha_ref,
            },
        })

        const { success, score } = response.data
        if (!success || score < 0.5) return res.status(401).send()

        return next()
    } catch (error) {
        logger.error('reCAPTCHA verification failed')
        logger.error(error)
    }
    return res.status(401).send()
}

export default recaptcha
