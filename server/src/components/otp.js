import { send } from './mail.js'

const OneTimePassword = (req, otpCollection, otpType) => {
    const otp = Math.floor(100000 + Math.random() * 900000)
    const dateNow = Date.now()
    Promise.all([
        otpCollection.insertOne({
            user_id: req.user._id,
            token: req.token,
            code: otp,
            verified: false,
            expired: false,
            type: otpType,
            created_at: dateNow,
            updated_at: dateNow,
        }),
        send(
            {
                to: req.user.email,
                subject: 'Core 1: One Time Password (OTP)',
                text: `<h2>Your One Time Password is:</h2><h4>${otp}</h4><p>This OTP is valid only for 10 mins, if you did not intend to log in to core 1, please ignore this email.</p><p>OTP is an extra layer of security used when logging into websites or apps. <b>DO NOT SHARE YOUR OTP CODE</b>.</p>`,
            },
            req.user.first_name,
        ),
    ])
}

export default OneTimePassword
