import axios from 'axios'
import GithubAccessToken from '../github/accesstoken.js'
import logger from '../../utils/logger.js'
import FormOauth2 from './formOauth2.js'

// its beefy isnt it?
/**
 * Verifies the Github OAuth2 token and retrieves user information.
 *
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */
const Github = async (req, res) => {
    try {
        const { code, location } = req.body
        if (!code || !location) return res.status(400).json({ error: 'Invalid request' })
        const accessToken = await GithubAccessToken(code)
        if (!accessToken) return res.status(400).json({ error: 'Invalid request' })

        const response = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
        })

        const fullName = response.data.name
        const nameParts = fullName.split(' ')
        req.body.credential = {
            email: response.data.email,
            given_name: nameParts[0],
            family_name: nameParts[nameParts.length - 1],
            picture: response.data.avatar_url,
        }
        return await FormOauth2(req, res)
    } catch (err) {
        logger.error(err)
    }
    return res.status(500).json({ error: 'Internal server error' })
}

export default Github
