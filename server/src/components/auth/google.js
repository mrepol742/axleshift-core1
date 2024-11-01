import axios from 'axios'
import logger from '../logger.js'
import FormOauth2 from './formOauth2.js'

const Google = async (req, res) => {
    try {
        const access_token = req.body.credential
        if (!access_token) return res.status(400).send()

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
    return res.status(500).send()
}

export default Google
