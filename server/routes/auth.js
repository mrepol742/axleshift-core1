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
  Url: POST /api/auth/register
  Params:
     email
     firstName
     lastName
     password
     recaptchaRef
  Returns:
     status
*/
router.post("/register", recaptcha, async (req, res) => {
    try {
        const { email, first_name, last_name, password } = req.body;
        if (!email || !first_name || !last_name || !password) return res.json({ status: 401 });

        const db = await connectToDatabase();
        const collection = db.collection("users");
        const existingEmail = await collection.findOne({ email: email });

        if (existingEmail) {
            logger.error("Email id already exists");
            return res.json({ status: 409 });
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

        return res.json({ status: 201 });
    } catch (e) {
        logger.error(e);
        res.json({ status: 500 });
    }
});

/*
  Url: POST /api/auth/login
  Params:
     email
     password
     recaptchaRef
  Returns:
     status
     token
*/
router.post("/login", recaptcha, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.json({ status: 401 });

        const db = await connectToDatabase();
        const collection = db.collection("users");
        const theUser = await collection.findOne({ email: email });

        if (!theUser) return res.json({ status: 404 });

        if (passwordHash(password) != theUser.password) return res.json({ status: 401 });
        addUserProfileToSession(theUser);

        const session_token = crypto.createHash("sha256").update(generateUniqueId()).digest("hex");
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        addSession(theUser, session_token, ip, req.headers["user-agent"]);

        res.json({ status: 200, token: session_token });
        // finally the end :(
    } catch (e) {
        logger.error(e);
        res.json({ status: 500 });
    }
});

/*
  Url: POST /api/auth/verify
  Params:
     token
  Returns:
     status
     email
*/
router.post("/verify", auth, function (req, res, next) {
    res.json({ status: 200, email: req.email });
});

/*
  Url: POST /api/auth/user
  Params:
     token
  Returns:
     status
     user
*/
router.post("/user", auth, async function (req, res, next) {
    const db = await connectToDatabase();
    const collection = db.collection("users");
    const theUser = await collection.findOne({ email: req.email });
    res.json({
        status: 200,
        user: {
            email: theUser.email,
            first_name: theUser.first_name,
            last_name: theUser.last_name,
        },
    });
});

/*
  Url: POST /api/auth/logout
  Params:
     token
  Returns:
     status
*/
router.post("/logout", auth, function (req, res, next) {
    removeSession(req.token);

    res.json({ status: 200 });
});

export default router;
