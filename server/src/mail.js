import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import logger from "../logger.js";

let mailInstance = null;

const connectToMailProvider = async () => {
    if (mailInstance) return mailInstance;

    try {
        mailInstance = nodemailer.createTransport({
            service: process.env.MAIL_SERVICE,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        logger.info("Connected successfully to mail server");
    } catch (err) {
        logger.error(err);
    }
};

export const sendMail = async (options) => {
    options.from = process.env.MAIL_FROM_ADDRESS;

    mailInstance.sendMail(options, (error, info) => {
        if (error) return logger.error(error);
        logger.info(`Email has been sent: ${info.response}`);
    });
};

export default connectToMailProvider;
