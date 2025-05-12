import axios from 'axios'
import logger from '../../utils/logger.js'
import FormOauth2 from './formOauth2.js'

/**
 * Verifies the Google OAuth2 token and retrieves user information.
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @return {Promise<void>}
 */
const Google = async (req, res) => {
    try {
        const access_token = req.body.credential
        if (!access_token) return res.status(400).json({ error: 'Invalid request' })

        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        })

        req.body.credential = {
            email: response.data.email,
            given_name: response.data.given_name,
            family_name: response.data.family_name,
            picture: response.data.picture,
        }
        return await FormOauth2(req, res)
    } catch (err) {
        logger.error(err)
    }
    return res.status(500).json({ error: 'Internal server error' })
}

export default Google
