import dotenv from "dotenv";
dotenv.config();
import express from "express";
import database from "../../models/db.js";
import logger from "../../components/logger.js";
import scm from "../../components/scm.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
    const gds_advisory = await scm();

    return res.status(200).json({ scm: gds_advisory });
});

router.get("/scan", auth, async (req, res) => {
    const gds_advisory = await scm();

    return res.status(200).json({ scm: gds_advisory });
});

export default router;
