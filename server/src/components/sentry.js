import dotenv from "dotenv";
dotenv.config();
import logger from "./logger.js";
import axios from "axios";

let last_fetch;
let response = [];

const sentry = async () => {
    if (!last_fetch || response.length === 0) return await fetch();

    const past = new Date(last_fetch);
    const ten = 10 * 60 * 1000;

    if (!(Date.now() - past > ten)) return response;
    return await fetch();
};

const fetch = async () => {
    try {
    } catch (err) {
        logger.error(err);
    }
    return [];
};

export default sentry;
