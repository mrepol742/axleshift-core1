import dotenv from "dotenv";
dotenv.config();
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
    dsn: process.env.SENTRY_DNS,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    disableInstrumentationWarnings: true,
});

import logger from "./components/logger.js";
import app from "./Server.js";
import db from "./models/db.js";
import mail from "./components/mail.js";
import cron from "./components/cron.js";

const port = process.env.EXPRESS_PORT || 5051;

process.on("uncaughtException", (err, origin) => {
    logger.error(err);
    //haysssssssssssssssssssssssssssssssssss
});

process.on("unhandledRejection", (reason, promise) => {
    logger.error(reason);
});

app.listen(port, (err) => {
    if (err) return logger.error("unable to start server", err);
    Promise.all([db(), mail(), cron()]);
    logger.info(`server running on port ${port}`);
});

Sentry.setupExpressErrorHandler(app);
