import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import logger from "./logger.js";

let mailInstance = null;

const mail = async () => {
    if (mailInstance) return mailInstance;

    try {
        mailInstance = await nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        logger.info("successfully connected to Google SMTP");
    } catch (err) {
        logger.error("failed connecting to Google SMTP");
        logger.error(err);
    }
    return mailInstance;
};

export const send = (options, name) => {
    options.from = process.env.MAIL_FROM_ADDRESS;
    options.html = body(options.subject, name, options.text);

    mailInstance.sendMail(options, (error, info) => {
        if (error) return logger.error(error);
    });
};

const body = (subject, name, message) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #ffffff;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: #323a49;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        .logo {
            max-width: 250px;
            padding: 20px;
        }
        .header {
            padding: 10px 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
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
    </style>
</head>
<body>
    <div class="container">
            <img src="https://mrepol742.github.io/assets/images/core1.png" alt="Logo" class="logo">
            <h2>${subject}</h2>
        </div>
        <div class="content">
            <p>Hi ${name},</p>
            <p>${message}</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Axleshift Core 1. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
};

export default mail;
