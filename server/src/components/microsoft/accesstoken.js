import axios from 'axios'
import qs from 'qs'
import logger from '../../utils/logger.js'
import { MICROSOFT_OAUTH_CLIENT_ID, MICROSOFT_OAUTH_SECRET_ID } from '../../config.js'

const MicrosoftAccessToken = async (code) => {
    try {
        const response = await axios.post(
            'https://login.microsoftonline.com/consumers/oauth2/v2.0/token',
            qs.stringify({
                client_id: MICROSOFT_OAUTH_CLIENT_ID,
                scope: 'openid profile email User.Read',
                code: code,
                redirect_uri: 'http://localhost:3000/auth/microsoft/callback',
                grant_type: 'authorization_code',
                client_secret: MICROSOFT_OAUTH_SECRET_ID,
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            },
        )

        if (response.data.access_token) return response.data.access_token
    } catch (err) {
        // logger.error(err.response?.data || err.message)
        logger.error(err)
    }
    return null
}

export default MicrosoftAccessToken
