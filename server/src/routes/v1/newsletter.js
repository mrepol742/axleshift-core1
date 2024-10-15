import dotenv from "dotenv";
dotenv.config();
import { ObjectId } from "mongodb";
import express from "express";
import database from "../../models/db.js";
import logger from "../../components/logger.js";
import recaptcha from "../../middleware/recaptcha.js";

const router = express.Router();

router.post("/", recaptcha, async (req, res) => {
    try {
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});

export default router;
