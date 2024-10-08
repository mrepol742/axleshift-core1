import fs from "fs";
import { ObjectId } from "mongodb";
import database from "../models/db.js";
import logger from "../src/logger.js";

export const addSession = async (theUser, sessionToken, ip, userAgent) => {
    try {
        const db = await database();
        const collection = db.collection("sessions");
        await collection.insertOne({
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
        const collection = db.collection("sessions");
        const session = await collection.findOne({ token: sessionToken });
        if (!session) return null;
        const userCollection = db.collection("users");
        const theUser = await userCollection.findOne({ _id: session.user_id });
        return {
            _id: theUser._id,
            email: theUser.email,
            first_name: theUser.first_name,
            last_name: theUser.last_name,
            role: theUser.role,
        };
    } catch (e) {
        logger.error(e);
    }
    return null;
};

export const removeSession = async (sessionToken) => {
    try {
        const db = await database();
        const collection = db.collection("sessions");
        await collection.updateOne(
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

export const isActiveToken = async (sessionToken) => {
    try {
        const db = await database();
        const collection = db.collection("sessions");
        const session = await collection.findOne({ token: sessionToken });
        return session.active;
    } catch (e) {
        logger.error(e);
    }
    return false;
}