import express from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import db from "../models/db.js";
const logger = require('../logger');
import { ObjectId } from "mongodb";

const JWT_SECRET = `${process.env.JWT_SECRET}`;
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const email = req.body.email;
        const collection = db.collection("users");
        const existingEmail = await collection.findOne({ email: req.body.email });

        if (existingEmail) {
            logger.error('Email id already exists');
            return res.status(400).json({ error: 'Email id already exists' });
        }
       
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const newUser = await collection.insertOne({
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: hash,
            created_at: new Date(),
            updated_at: new Date()
        });
        const payload = {
            user: {
                id: newUser.insertedId
            }
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User registered successfully');
        res.json({ authtoken, email });
    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});

router.post("/login", async (req, res) => {
    try {
        let collection = await db.collection("users");
        const theUser = await collection.findOne({ email: req.body.email });
        if (theUser) {
            const result = await bcryptjs.compare(req.body.password, theUser.password);
            if (!result) {
                logger.error("Passwords do not match");
                return res.status(404).json({ error: "Wrong pasword" });
            }

            const userName = theUser.first_name;
            const userEmail = theUser.email;

            const payload = {
                user: {
                    id: theUser._id.toString(),
                },
            };
            const authtoken = jwt.sign(payload, JWT_SECRET);
            res.json({ authtoken, userName, userEmail });
        } else {
            logger.error("User not found");
            return res.status(404).json({ error: "User not found" });
        }
    } catch (e) {
        logger.error(e);
        return res.status(500).send("Internal server error");
    }
});

export default router;
