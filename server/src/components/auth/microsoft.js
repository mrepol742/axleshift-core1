import axios from 'axios'
import MicrosoftAccessToken from '../microsoft/accesstoken.js'
import logger from '../../utils/logger.js'
import FormOauth2 from './formOauth2.js'

// 2025
const Microsoft = async (req, res) => {
    try {
        const { code, location } = req.body
        logger.info(code)
        if (!code || !location) return res.status(400).json({ error: 'Invalid request' })
        const accessToken = await MicrosoftAccessToken(code)
        logger.info(accessToken)
        if (!accessToken) return res.status(400).json({ error: 'Invalid request' })

        const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        })

        logger.info(response.data)

        // const fullName = response.data.name
        // const nameParts = fullName.split(' ')
        // req.body.credential = {
        //     email: response.data.email,
        //     given_name: nameParts[0],
        //     family_name: nameParts[nameParts.length - 1],
        //     picture: response.data.avatar_url,
        //     request_type: 'github_user',
        // }
        // return await FormOauth2(req, res)
    } catch (err) {
        logger.error(err)
    }
    return res.status(500).json({ error: 'Internal server error' })
}

export default Microsoft
