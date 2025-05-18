import nodemailer from 'nodemailer'
import { MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM_ADDRESS } from '../config.js'
import logger from '../utils/logger.js'

let mailInstance = null

/**
 * Creates a mail instance using nodemailer.
 *
 * @return {Promise<nodemailer.Transporter>}
 */
const mail = async () => {
    if (mailInstance) return mailInstance

    try {
        mailInstance = await nodemailer.createTransport({
            host: MAIL_HOST,
            port: MAIL_PORT,
            secure: false,
            auth: {
                user: MAIL_USERNAME,
                pass: MAIL_PASSWORD,
            },
        })

        logger.info('successfully connected to Google SMTP')
    } catch (err) {
        logger.error('failed connecting to Google SMTP')
        logger.error(err)
    }
    return mailInstance
}

/**
 * Sends an email using the mail instance.
 * @param {Object} options
 * @param {String} name
 * @param {Boolean} isNotSystem
 * @return {Promise<void>}
 */
export const send = (options, name, isNotSystem = false) => {
    options.from = MAIL_FROM_ADDRESS
    options.subject = `[Axleshift] ${options.subject}`
    options.html = body(
        `[Axleshift] ${options.subject}`,
        options.to,
        name,
        options.text,
        isNotSystem,
    )

    mailInstance.sendMail(options, (error, info) => {
        if (error) return logger.error(error)
    })
}

/**
 * Generates the HTML body for the email.
 *
 * @param {String} subject
 * @param {String} email
 * @param {String} name
 * @param {String} message
 * @param {Boolean} isNotSystem
 * @return {String}
 */
const body = (subject, email, name, message, isNotSystem) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Axleshift] ${subject}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            padding: 5px;
        }
        .body {
            max-width: 600px;
            margin: auto;
            padding: 25px;
        }
        .logo {
            max-width: 550px;
        }
        .header {
            text-align: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        .footer {
            text-align: center;
            margin-top: 15px;
            font-size: 12px;
            color: #6c757d;
        }
        .button {
            display: inline-block;
            padding: 10px 15px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
        }
        .small {
           font-size: 0.8em;
        }
        .text-center {
           text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://core1.axleshift.com/images/banner.png" alt="Banner" class="logo">
        </div>
        <div class="body">
            <div class="content">
            ${isNotSystem === false ? `<h1>Hi ${name},</h1><p>${message}</p>` : `${message}`}
            <hr>
            <p class="text-center small">
                This email was intended for ${email}. ${isNotSystem === false ? `This is a system generated message, please do not reply to this email.` : "You received this email because you're a registered user of Axleshift."}
            </p>
        </div>
        <div class="footer">
            <p>&copy; 2025 Axleshift. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `
}

export default mail
