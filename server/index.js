import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import users from "./routes/users.js";
import csrf from "csrf";

const app = express();
const PORT = process.env.APP_PORT;

app.use(cors());
app.use(express.json());

app.use("/api/users", users);

app.listen(PORT, () => {
    console.log(`[Listening to Port] ${PORT}`);
});
