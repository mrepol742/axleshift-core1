import axios from 'axios'
import logger from '../logger.js'

const recaptcha = async (req, res, next) => {
    const { recaptcha_ref } = req.body

    if (!recaptcha_ref) return res.status(401)

    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET,
                response: recaptcha_ref,
            },
        })

        const { success, score } = response.data

        if (!success || score < 0.5) return res.status(401)
    
        next()
    } catch (error) {
        logger.info(`reCAPTCHA verification failed: ${error}`)
        return res.status(500)
    }
};

export default recaptcha
