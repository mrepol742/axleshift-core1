import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import connectToDatabase from "../models/db.js";
import logger from "../logger.js";
import { addSession, addUserProfileToSession, removeSession } from "../src/sessions.js";
import auth from "../middleware/auth.js";
import recaptcha from "../middleware/recaptcha.js";
import passwordHash, { generateUniqueId } from "../src/password.js";

const router = express.Router();

/*
  Url: POST /api/v1/auth/register
  Params:
     email
     firstName
     lastName
     password
     recaptcha_ref
*/
// TODO: recaptcha in this route is not working properly
// router.post("/register", recaptcha, async (req, res) => {
    /*
       [0] [11:58:31.335] INFO (49191):
[0]     success: false
[0]     error-codes: [
[0]       "invalid-input-response"
[0]     ]
    */
router.post("/register", async (req, res) => {
    try {
        const { email, first_name, last_name, password, repeat_password } = req.body;
        if (!email || !first_name || !last_name || !password || !repeat_password) return res.status(400).send();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(200).json({ error: 'Invalid email address' });
        if (password.length < 8) return res.status(200).json({ error: 'Password must be greater than 8 digit' });
        if (password != repeat_password) return res.status(200).json({ error: 'Password does not match' });

        const db = await connectToDatabase();
        const collection = db.collection("users");
        const existingEmail = await collection.findOne({ email: email });

        if (existingEmail) {
            logger.error("Email id already exists");
            return res.status(409).send();
        }

        await collection.insertOne({
            email: email,
            first_name: first_name,
            last_name: last_name,
            role: "user",
            password: passwordHash(password),
            email_verify_at: "",
            created_at: new Date(),
            update_at: new Date(),
        });

        return res.status(201).send();
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});

/*
  Url: POST /api/v1/auth/login
  Params:
     email
     password
     recaptcha_ref
  Returns:
     token
*/
router.post("/login", recaptcha, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send();

        const db = await connectToDatabase();
        const collection = db.collection("users");
        const theUser = await collection.findOne({ email: email });

        if (!theUser) return res.status(404).send();

        if (passwordHash(password) != theUser.password) return res.status(401).send();
        addUserProfileToSession(theUser);

        const session_token = crypto.createHash("sha256").update(generateUniqueId()).digest("hex");
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        addSession(theUser, session_token, ip, req.headers["user-agent"]);

        return res.status(200).json({
            token: session_token
          });
        // finally the end :(
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});

/*
  Url: POST /api/v1/auth/verify
  Params:
     token
  Returns:
     email
*/
router.post("/verify", auth, function (req, res, next) {
    return res.status(200).json({
        email: req.email 
      });
});

/*
  Url: POST /api/v1/auth/user
  Params:
     token
  Returns:
     user
*/
router.post("/user", auth, async function (req, res, next) {
    try {
    const db = await connectToDatabase();
    const collection = db.collection("users");
    const theUser = await collection.findOne({ email: req.email });

    return res.status(200).json({
        user: {
            email: theUser.email,
            first_name: theUser.first_name,
            last_name: theUser.last_name,
        },
      });
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});

/*
  Url: POST /api/v1/auth/logout
  Params:
     token
*/
router.post("/logout", auth, function (req, res, next) {
    removeSession(req.token);

    return res.status(200).send();
});

export default router;
