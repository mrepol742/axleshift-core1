import axios from 'axios'
import MicrosoftAccessToken from '../microsoft/accesstoken.js'
import logger from '../../utils/logger.js'
import FormOauth2 from './formOauth2.js'

// 2025
/**
 * Verifies the Microsoft OAuth2 token and retrieves user information.
 *
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */
const Microsoft = async (req, res) => {
    try {
        const { code, location } = req.body
        if (!code || !location) return res.status(400).json({ error: 'Invalid request' })
        const accessToken = await MicrosoftAccessToken(code)
        if (!accessToken) return res.status(400).json({ error: 'Invalid request' })

        const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        })

        req.body.credential = {
            email: response.data.mail,
            given_name: response.data.givenName,
            family_name: response.data.surname,
            picture: null,
        }
        return await FormOauth2(req, res)
    } catch (err) {
        logger.error(err)
    }
    return res.status(500).json({ error: 'Internal server error' })
}

export default Microsoft
