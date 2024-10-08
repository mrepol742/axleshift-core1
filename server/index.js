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

import logger from "./src/logger.js";
import server from "./Server.js";

process.on("SIGHUP", function () {
    process.exit(0);
});

process.on("SIGTERM", function () {
    process.exit(0);
});

process.on("SIGINT", function () {
    process.exit(0);
});

process.on("uncaughtException", (err, origin) => {
    logger.error(err);
    //haysssssssssssssssssssssssssssssssssss
});

process.on("unhandledRejection", (reason, promise) => {
    logger.error(reason);
});

process.on("beforeExit", (code) => {
    process.exit(code);
});

process.on("exit", (code) => {
    logger.info("Server offline");
    process.kill(process.pid);
});