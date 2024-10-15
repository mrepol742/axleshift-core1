import dotenv from "dotenv";
dotenv.config();
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
    dsn: process.env.SENTRY_DNS,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
});

import logger from "./components/logger.js";
import "./Server.js";

process.on("uncaughtException", (err, origin) => {
    logger.error(err);
    //haysssssssssssssssssssssssssssssssssss
});

process.on("unhandledRejection", (reason, promise) => {
    logger.error(reason);
});
