import dotenv from "dotenv";
dotenv.config();
import { ObjectId } from "mongodb";
import express from "express";
import database from "../../models/db.js";
import logger from "../../components/logger.js";
import scm from "../../components/scm.js";
import auth from "../../middleware/auth.js";
import { getUser } from "../../components/sessions.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
    const [gds_advisory, updatedSessions] = await Promise.all([
        scm(),
        (async () => {
            const theUser = await getUser(req.token);
            const db = await database();

            const sessions = await db
                .collection("sessions")
                .find(theUser.role !== "admin" ? { user_id: new ObjectId(theUser._id) } : {})
                .sort({ last_accessed: -1 })
                .toArray();

            return sessions;
        })(),
    ]);

    return res.status(200).json({ scm: gds_advisory, sessions: updatedSessions });
});

router.get("/scan", auth, async (req, res) => {
    const [gds_advisory] = await Promise.all([scm()]);

    return res.status(200).json({ scm: gds_advisory });
});

export default router;
