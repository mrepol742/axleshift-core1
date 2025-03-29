import { send } from './mail.js'
import { setCache } from '../models/redis.js'

const ten = 10 * 60 * 1000

const OneTimePassword = (req, otpType) => {
    const otp = Math.floor(100000 + Math.random() * 900000)
    const dateNow = Date.now()
    const data = {
        user_id: req.user._id,
        code: otp,
        verified: false,
        expired: false,
        type: otpType,
        created_at: dateNow,
        updated_at: dateNow,
    }
    Promise.all([
        setCache(`user-id-${req.user._id}`, data, ten),
        send(
            {
                to: req.user.email,
                subject: 'One Time Password',
                text: `<h2>Your One Time Password is:</h2><h2>${otp}</h2><p>This OTP is valid only for 10 mins, if you did not intend to log in to axleshift, please ignore this email.</p><p>OTP is an extra layer of security used when logging into websites or apps. <b>DO NOT SHARE YOUR OTP CODE</b>.</p>`,
            },
            req.user.first_name,
        ),
    ])
}

export default OneTimePassword
