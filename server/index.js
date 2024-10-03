import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import multer from "multer";
import cron from "node-cron";
import fs from "fs";
import mongoSanitize from 'express-mongo-sanitize';
import rateLimiter from "./middleware/rateLimiter.js";
import sanitize from "./middleware/sanitize.js";
import auth from "./routes/auth.js";
import freight from "./routes/freight.js";
import track from "./routes/track.js";
import threat from "./routes/threat.js";
import logger from "./logger.js";
import connectToDatabase from "./models/db.js";
import sessions from "./src/sessions.js";
import log from "./src/log.js";

const app = express();
const upload = multer();
const port = 5050;

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
    log(err);
    //haysssssssssssssssssssssssssssssssssss
});

process.on("unhandledRejection", (reason, promise) => {
    logger.error(reason);
    log(reason);
});

process.on("beforeExit", (code) => {
    process.exit(code);
});

process.on("exit", (code) => {
    fs.writeFileSync("./sessions/sessions.json", JSON.stringify(sessions), (err) => {
        if (err) throw err;
        logger.info("Sessions save");
    });
    log(`Server exited with code ${code}`);
    logger.info("Server offline");
    process.kill(process.pid);
});

cron.schedule("0 * * * *", () => {
    fs.writeFileSync("./sessions/sessions.json", JSON.stringify(sessions), (err) => {
        if (err) throw err;
        logger.info("Sessions save");
    });
});

app.use(upload.none());
app.use(express.json());
app.use(pinoHttp({ logger }));
app.use(rateLimiter);
app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
    })
);
app.use(sanitize);
app.use(
    mongoSanitize({
        onSanitize: ({ req, key }) => {
            logger.warn(`This request[${key}] is sanitized`);
            logger.warn(req);
        },
    })
);

app.use("/api/auth", auth);
app.use("/api/freight", freight);
app.use("/api/track", track);
app.use("/api/threat", threat);

app.use((err, req, res, next) => {
    logger.error(err);
    res.json({ status: 500 });
});

app.get("/", (req, res) => {
    res.send("Freight Core 1");
});

app.listen(port, async () => {
    await connectToDatabase();
    log(`Server running on port ${port}`)
    logger.info(`Server running on port ${port}`);
});
