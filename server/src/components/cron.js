import cron from "node-cron";
import sessionTask from "../tasks/sessions.js";
import logger from "./logger.js"

const _cron = () => {
cron.schedule('0 * * * *', sessionTask).start();
logger.info("Cron tasks has started.");
}

export default _cron;