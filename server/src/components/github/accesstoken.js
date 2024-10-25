import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios'
import logger from '../logger.js'

const GithubAccessToken = async (code) => {
    try {
        const response = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
                client_secret: process.env.GITHUB_OAUTH_SECRET_ID,
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
