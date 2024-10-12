import dotenv from "dotenv";
dotenv.config();
import { ObjectId } from "mongodb";
import express from "express";
import moment from "moment";
import UAParser from "ua-parser-js";
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
            const collection = await db.collection("sessions");

            const sessions = await collection
                .find(theUser.role !== "admin" ? { user_id: new ObjectId(theUser._id) } : {})
                .sort({ last_accessed: -1 })
                .toArray();

            const parseUserAgent = (user_agent) => {
                const parser = new UAParser(user_agent);
                const result = parser.getResult();
                return `${result.browser.name} ${result.os.name} ${result.cpu.architecture}`;
            };

            return sessions.map((session) => {
                const newUserAgent = parseUserAgent(session.user_agent);
                const newActive = session.status ? "Active" : "Inactive";
                const newLastaccessed = moment(session.last_accessed).fromNow();

                return {
                    ...session,
                    user_agent: newUserAgent,
                    active: newActive,
                    last_accessed: newLastaccessed,
                };
            });
        })(),
    ]);

    return res.status(200).json({ scm: gds_advisory, sessions: updatedSessions });
});

router.get("/scan", auth, async (req, res) => {
    const [gds_advisory] = await Promise.all([scm()]);

    return res.status(200).json({ scm: gds_advisory });
});

export default router;
