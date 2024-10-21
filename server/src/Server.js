import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import pinoHttp from "pino-http";
import multer from "multer";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import statusMonitor from "express-status-monitor";
import compression from "compression";

import rateLimiter from "./middleware/rateLimiter.js";
import sanitize from "./middleware/sanitize.js";

import logger from "./components/logger.js";

import APIv1 from "./routes/v1/index.js";

const app = express();
const upload = multer();

app.use(compression());
app.use(cors({ origin: "*" }));
app.use(
    statusMonitor({
        title: "Server",
    })
);
app.use(helmet());
app.use(upload.none());
app.use(express.json());
app.use(pinoHttp({ logger }));
app.use(rateLimiter);
app.use(sanitize);
app.use(
    mongoSanitize({
        onSanitize: ({ req, key }) => {
            logger.warn(`this request[${key}] is sanitized`);
            logger.warn(req);
        },
    })
);

app.use(express.static(path.join(process.cwd(), 'public')));
app.use("/api/v1/", APIv1);

app.use((err, req, res, next) => {
    logger.error(err);
    return res.status(500).send();
});

app.get("/", (req, res) => {
    res.send("If you can read this means this server is working.");
});

if (process.env.NODE_ENV !== "production")
    app.get("/debug-sentry", (req, res) => {
        throw new Error("This is a test DON't PaNICCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC");
    });

export default app;
