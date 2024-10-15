import dotenv from "dotenv";
dotenv.config();
import { ObjectId } from "mongodb";
import express from "express";
import database from "../../models/db.js";
import logger from "../../components/logger.js";
import recaptcha from "../../middleware/recaptcha.js";

const router = express.Router();

router.post("/", recaptcha, async (req, res) => {
    try {
        const email = req.body.email;
        if (!email) return res.status(400).send();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(200).json({ message: "Invalid email address" });

        const db = await database();
        const newsletterCollection = db.collection("newsletter");
        const existingSubscriber = await newsletterCollection.findOne({ email: email })
        if (existingSubscriber) {
            logger.error("Email already exists (newsletter)");
            return res.status(200).json({ message: "The email is already subcribe to our newsletter" });
        }

        await newsletterCollection.insertOne({
            email: email,
            is_subsribe: true,
            created_at: Date.now(),
            update_at: Date.now(),
        });

        return res.status(200).json({ message: "If you can see this message means it work" });
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});

export default router;
