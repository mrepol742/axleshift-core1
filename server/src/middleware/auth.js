import { getUser, isActiveToken } from "../components/sessions.js";
import database from "../models/db.js";
import { ObjectId } from "mongodb";

const adminRoute = [];

const auth = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).send();

    const token = authHeader.split(" ")[1];
    if (!token && !/^[0-9a-f]{64}$/.test(token)) return res.status(401).send();

    const [theUser, status] = await Promise.all([getUser(token), isActiveToken(token)]);

    if (!theUser || (adminRoute.includes(req.path) && theUser.role !== "admin")) return res.status(401).send();

    if (!status) return res.status(401).send();

    Promise.all([
        (async () => {
            const db = await database();
            db.collection("sessions").updateOne(
                { token: token },
                {
                    $set: {
                        last_accessed: Date.now(),
                    },
                }
            );
        })(),
    ]);
    req.token = token;
    req.user = theUser;
    return next();
};

export default auth;
