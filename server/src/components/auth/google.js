import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import logger from '../logger.js'
import FormOauth2 from './formOauth2.js'

const Google = async (req, res) => {
    try {
        req.body.credential = jwtDecode(req.body.credential)
        return await FormOauth2(req, res)
    } catch (err) {
        logger.error(err)
    }
    return res.status(500).send()
}

export default Google
