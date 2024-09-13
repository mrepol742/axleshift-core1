import express from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import connectToDatabase from "../models/db.js";
import logger from "../logger.js";
import { validationResult } from "express-validator";

const router = express.Router();
const JWT_SECRET = `${process.env.JWT_SECRET}`;

router.post("/register", async (req, res) => {
    try {
        const email = req.body.email;
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const existingEmail = await collection.findOne({ email: req.body.email });

        if (existingEmail) {
            logger.error("Email id already exists");
            return res.status(400).json({ error: "Email id already exists" });
        }
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            emailVerifiedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.json({ register: true });
    } catch (e) {
        logger.error(e);
        return res.status(500).send("Internal server error");
    }
});

router.post("/login", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const sessionCollection = db.collection("sessions");
        const theUser = await collection.findOne({ email: req.body.email });

        if (theUser) {
            const result = await bcryptjs.compare(req.body.password, theUser.password);
            if (!result) {
                logger.error("Passwords do not match");
                return res.status(404).json({ error: "Wrong password" });
            }

            const newUser = await sessionCollection.insertOne({
                user_id: theUser._id.toString(),
                ip_address: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
                user_agent: req.headers["user-agent"],
                lastActivity: new Date(),
            });

            const payload = {
                user: {
                    id: newUser.insertedId,
                },
            };
            let authToken = jwt.sign(payload, JWT_SECRET);

            await sessionCollection.updateOne({ _id: newUser.insertedId }, { $set: { authToken } });

            res.json({ authToken });
        } else {
            logger.error("User not found");
            return res.status(404).json({ error: "User not found" });
        }
    } catch (e) {
        logger.error(e);
        return res.status(500).send("Internal server error");
    }
});

router.put("/update", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error("Validation errors in update request", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const email = req.headers.email;

        if (!email) {
            logger.error("Email not found in the request headers");
            return res.status(400).json({ error: "Email not found in the request headers" });
        }
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const existingUser = await collection.findOne({ email });
        if (!existingUser) {
            logger.error("User not found");
            return res.status(404).json({ error: "User not found" });
        }
        existingUser.firstName = req.body.name;
        existingUser.updatedAt = new Date();
        const updatedUser = await collection.findOneAndUpdate({ email }, { $set: existingUser }, { returnDocument: "after" });

        const payload = {
            user: {
                id: updatedUser._id.toString(),
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.json({ authtoken });
    } catch (e) {
        logger.error(e);
        return res.status(500).send("Internal server error");
    }
});

export default router;
