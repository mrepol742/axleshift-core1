import dotenv from "dotenv";
dotenv.config();
import { ObjectId } from "mongodb";
import logger from "../logger.js";
import database from "../../models/db.js";

const external = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];

    const db = await database();
    const apiTokenCollection = db.collection("apiToken");
    const existingApiToken = await apiTokenCollection.findOne({ token: token, active: true });

    if (!existingApiToken) {
        logger.error(`Invalid or denied api token: ${token}`);
        return res.status(429).send();
    }

    Promise.all([
        (async () => {
            try {
                const db = await database();
                db.collection("apiToken").updateOne(
                    { token: token },
                    {
                        $set: {
                            last_accessed: Date.now(),
                        },
                    }
                );
            } catch (e) {
                logger.error(e);
            }
        })(),
    ]);

    req.token = token;

    setTimeout(() => {
        return next();
    }, process.env.API_RATE_DELAY);
};

export default external;
