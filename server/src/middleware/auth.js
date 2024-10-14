import { getUser, getSession } from "../components/sessions.js";
import database from "../models/db.js";
import { ObjectId } from "mongodb";

const adminRoute = [];

const auth = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).send();

    const token = authHeader.split(" ")[1];
    if (!token && !/^[0-9a-f]{64}$/.test(token)) return res.status(401).send();

    const [theUser, session] = await Promise.all([getUser(token), getSession(token)]);

    if (!theUser || (adminRoute.includes(req.path) && theUser.role !== "admin")) return res.status(401).send();

    if (!session.active) return res.status(401).send();
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const user_a = req.headers["user-agent"];

    const last_accessed = new Date(session.last_accessed);
    const diff = Date.now() - last_accessed;
    const week = 7 * 24 * 60 * 60 * 1000;
    // a week has pass so change the ip to 0
    // thus triggering the protocol down below!
    // hacky aint it?
    if (diff >= week) ip = 0;

    Promise.all([
        (async () => {
            try {
                const db = await database();
                const value = (session.ip_address === ip && session.user_agent === user_a);
                db.collection("sessions").updateOne(
                    { token: token },
                    {
                        $set: {
                            active: value,
                            compromised: value,
                            last_accessed: Date.now(),
                            modified_by: 'system',
                        },
                    }
                );
            } catch (e) {
                logger.error(e);
            }
        })(),
    ]);

    if (session.ip_address !== ip || session.user_agent !== user_a) return res.status(401).send();

    req.token = token;
    req.user = theUser;
    return next();
};

export default auth;
