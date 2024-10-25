import { send } from '../mail.js'

const sendOTPEmail = (req, otpCollection) => {
    const otp = Math.floor(100000 + Math.random() * 900000)
    Promise.all([
        otpCollection.insertOne({
            user_id: req.user._id,
            token: req.token,
            code: otp,
            verified: false,
            expired: false,
            created_at: Date.now(),
            updated_at: Date.now(),
        }),
        send(
            {
                to: req.user.email,
                subject: 'One Time Password (OTP)',
                text: `Your otp is ${otp}, valid for 10 minutes only.`,
            },
            req.user.first_name,
        ),
    ])
}

export default sendOTPEmail
