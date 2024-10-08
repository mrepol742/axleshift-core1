import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import logger from "../src/logger.js";

let mailInstance = null;

const mail = async () => {
    if (mailInstance) return mailInstance;

    try {
        mailInstance = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false, 
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        logger.info("Connected successfully to mail server");
    } catch (err) {
        logger.error(err);
    }
    return mailInstance;
};

export const send = async (options) => {
    options.from = process.env.MAIL_FROM_ADDRESS;

    mailInstance.sendMail(options, (error, info) => {
        if (error) return logger.error(error);
        logger.info(`Email has been sent: ${info.response}`);
    });
};

export default mail;
