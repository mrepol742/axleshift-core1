import fs from "fs";
import { ObjectId } from "mongodb";
import database from "../models/db.js";
import logger from "../src/logger.js";

let sessions = {};

fs.mkdir("./sessions", { recursive: true }, (err) => {
    if (err) throw err;
});

if (fs.existsSync("./sessions/sessions.json")) {
    const sessionFile = fs.readFileSync("./sessions/sessions.json", "utf8");
    if (sessionFile) {
        sessions = JSON.parse(sessionFile);
        logger.info("Sessions retrieved");
    }
}

export const addUserProfileToSession = (theUser) => {
    if (!sessions[theUser._id]) sessions[theUser._id] = {};
    if (!sessions[theUser._id]["profile"]) sessions[theUser._id]["profile"] = theUser;
};

export const addSession = (theUser, sessionToken, ip, userAgent) => {
    if (!sessions[theUser._id]) sessions[theUser._id] = {};

    sessions[theUser._id][sessionToken] = {
        active: true,
        ip_address: ip,
        user_agent: userAgent,
        last_accessed: Date.now(),
    };

    if (process.env.NODE_ENV !== "production") {
        fs.writeFileSync("./sessions/sessions.json", JSON.stringify(sessions), (err) => {
            if (err) throw err;
            logger.info("Sessions save");
        });
    }
};

export const getId = (sessionToken) => {
    return Object.keys(sessions).find((_id) => sessions[_id][sessionToken]);
};

export const getUser = async (sessionToken) => {
    const _id = getId(sessionToken);
    const theUser = sessions[_id]["profile"];
    return {
        _id: theUser._id,
        email: theUser.email,
        first_name: theUser.first_name,
        last_name: theUser.last_name,
        role: theUser.role,
    };
};

export const setUser = async (sessionToken, theUser) => {
    const _id = getId(sessionToken);
    sessions[_id]["profile"] = theUser;
};

export const removeSession = (sessionToken) => {
    const s = Object.keys(sessions).find((_id) => sessions[_id][sessionToken]);

    if (s) {
        const sessionEntry = sessions[s][sessionToken];
        if (sessionEntry) {
            sessionEntry.active = false;
        }
    }
};

export default sessions;
