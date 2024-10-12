import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import multer from "multer";
import mongoSanitize from "express-mongo-sanitize";
import * as Sentry from "@sentry/node";
import helmet from "helmet";

import rateLimiter from "./middleware/rateLimiter.js";
import sanitize from "./middleware/sanitize.js";
import corsOptions from "./middleware/cors.js";

import db from "./models/db.js";
import mail from "./components/mail.js";

import logger from "./components/logger.js";

import APIv1 from "./routes/v1/index.js";

const app = express();
const upload = multer();
const port = process.env.PORT;

app.use(upload.none());
app.use(helmet());
app.use(express.json());
app.use(pinoHttp({ logger }));
app.use(rateLimiter);
app.use(cors(corsOptions));
app.use(sanitize);
app.use(
    mongoSanitize({
        onSanitize: ({ req, key }) => {
            logger.warn(`This request[${key}] is sanitized`);
            logger.warn(req);
        },
    })
);

app.use("/api/v1/", APIv1);

app.use((err, req, res, next) => {
    logger.error(err);
    return res.status(500).send();
});

app.get("/", (req, res) => {
    res.send("Backend Core 1");
});

if (process.env.NODE_ENV !== "production")
    app.get("/debug-sentry", (req, res) => {
        throw new Error("This is a test");
    });

app.listen(port, async () => {
    Promise.all([db(), mail()]);
    logger.info(`Server running on port ${port}`);
});

Sentry.setupExpressErrorHandler(app);

export default app;
