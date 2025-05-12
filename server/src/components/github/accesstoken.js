import axios from 'axios'
import logger from '../../utils/logger.js'
import { GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_SECRET_ID } from '../../config.js'

/**
 * Verifies the Github OAuth2 code and retrieves the access token.
 * 
 * @param {String} code 
 * @return {Promise<String|null>}
 */
const GithubAccessToken = async (code) => {
    try {
        const response = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: GITHUB_OAUTH_CLIENT_ID,
                client_secret: GITHUB_OAUTH_SECRET_ID,
                code,
            },
            {
                headers: {
                    Accept: 'application/json',
                },
            },
        )

        if (response.data.access_token) return response.data.access_token
    } catch (err) {
        logger.error(err)
    }
    return null
}

export default GithubAccessToken
