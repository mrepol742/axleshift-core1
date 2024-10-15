import { ObjectId } from "mongodb";
import database from "../models/db.js";
import logger from "../components/logger.js";

const sessions = () => {
    Promise.all([
        (async () => {
            try {
                const db = await database();
                const sessionsCollection = db.collection("sessions");
                const sessions = await sessionsCollection.find({ active: false }).toArray();

                if (sessions.length === 0) return;

                for (const session of sessions) {
                    const last_accessed = new Date(session.last_accessed);
                    const diff = Date.now() - last_accessed;
                    const week = 7 * 24 * 60 * 60 * 1000;

                    if (diff >= week) {
                        sessionsCollection.updateOne(
                            { _id: new ObjectId(session._id) },
                            {
                                $set: {
                                    active: false,
                                    last_accessed: Date.now(),
                                    modified_by: "system",
                                },
                            }
                        );
                    }
                }
            } catch (e) {
                logger.error(e);
            }
        })(),
    ]);
};

export default sessions;
