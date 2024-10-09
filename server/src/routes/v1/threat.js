import dotenv from "dotenv";
dotenv.config();
import express from "express";
import database from "../../models/db.js";
import logger from "../../components/logger.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
});

router.post("/scan", auth, async (req, res) => {
});

export default router;
