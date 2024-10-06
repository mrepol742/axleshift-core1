import fs from "fs";
import db from "../models/db.js";
import logger from "../src/logger.js";

let sessions = {};

fs.mkdir("./sessions", { recursive: true }, (err) => {
    if (err) throw err;
});

if (fs.existsSync("./sessions/sessions.json")) {
    sessions = JSON.parse(fs.readFileSync("./sessions/sessions.json", "utf8"));
    logger.info("Sessions retrieved");
}

export const addUserProfileToSession = (theUser) => {
    if (!sessions[theUser.email]) sessions[theUser.email] = {};
    if (!sessions[theUser.email]["profile"]) sessions[theUser.email]["profile"] = theUser;
};

export const addSession = (theUser, sessionToken, ip, userAgent) => {
    if (!sessions[theUser.email]) sessions[theUser.email] = {};

    sessions[theUser.email][sessionToken] = {
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

export const getEmailAddress = (sessionToken) => {
    return Object.keys(sessions).find((email) => sessions[email][sessionToken]);
};

export const getUserId = async (sessionToken) => {
    const email = getEmailAddress(sessionToken);
    const db = await db();

    const useCollection = db.collection("users");
    const theUser = await useCollection.findOne({ email: email });
    return theUser._id;
};

export const removeSession = (sessionToken) => {
    const s = Object.keys(sessions).find((email) => sessions[email][sessionToken]);

    if (s) {
        const sessionEntry = sessions[s][sessionToken];
        if (sessionEntry) {
            sessionEntry.active = false;
        }
    }
};

export default sessions;
