import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import auth from "./routes/auth.js";
import user from "./routes/user.js";
import csrf from "csrf";
import logger from "./logger.js";
import pinoHttp from "pino-http";
import connectToDatabase from "./models/db.js";

const app = express();
const port = 5050;

app.use("*", cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.use("/api/auth", auth);
app.use("/api/user", user);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Internal Server Error");
});

app.get("/", (req, res) => {
    res.send("Inside the server");
});

app.listen(port, async () => {
    await connectToDatabase();
    logger.info(`Server running on port ${port}`);
});
