import axios from 'axios'
import GithubAccessToken from '../github/accesstoken.js'
import logger from '../../utils/logger.js'
import FormOauth2 from './formOauth2.js'

// its beefy isnt it?
const Github = async (req, res) => {
    try {
        const { code, location } = req.body
        if (!code || !location) return res.status(400).send()
        const accessToken = await GithubAccessToken(code)
        if (!accessToken) return res.status(400).send()

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
            request_type: 'github_user',
        }
        return await FormOauth2(req, res)
    } catch (err) {
        logger.error(err)
    }
    return res.status(500).send()
}

export default Github
