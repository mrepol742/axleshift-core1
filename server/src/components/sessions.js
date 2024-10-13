import fs from "fs";
import { ObjectId } from "mongodb";
import database from "../models/db.js";
import logger from "./logger.js";

export const addSession = async (theUser, sessionToken, ip, userAgent) => {
    try {
        const db = await database();
        db.collection("sessions").insertOne({
            user_id: theUser._id,
            token: sessionToken,
            active: true,
            ip_address: ip,
            user_agent: userAgent,
            last_accessed: Date.now(),
        });
    } catch (e) {
        logger.error(e);
    }
};

export const getUser = async (sessionToken) => {
    try {
        const db = await database();
        const session = await db.collection("sessions").findOne({ token: sessionToken });
        if (!session) return null;
        const theUser = await db.collection("users").findOne({ _id: session.user_id });

        return {
            _id: theUser._id,
            email: theUser.email,
            first_name: theUser.first_name,
            last_name: theUser.last_name,
            role: theUser.role,
            email_verify_at: theUser.email_verify_at,
        };
    } catch (e) {
        logger.error(e);
    }
    return null;
};

export const removeSession = async (sessionToken) => {
    try {
        const db = await database();
        await db.collection("sessions").updateOne(
            { token: sessionToken },
            {
                $set: {
                    active: false,
                    last_accessed: Date.now(),
                },
            }
        );
    } catch (e) {
        logger.error(e);
    }
};

export const getSession = async (sessionToken) => {
    try {
        const db = await database();
        const session = await db.collection("sessions").findOne({ token: sessionToken });
        if (session.active)
            db.collection("sessions").updateOne(
                { token: sessionToken },
                {
                    $set: {
                        last_accessed: Date.now(),
                    },
                }
            );
        return session;
    } catch (e) {
        logger.error(e);
    }
    return null;
};
