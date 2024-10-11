import dotenv from "dotenv";
dotenv.config();
import { ObjectId } from "mongodb";
import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import database from "../../models/db.js";
import logger from "../../components/logger.js";
import { addSession, removeSession, getUser } from "../../components/sessions.js";
import auth from "../../middleware/auth.js";
import recaptcha from "../../middleware/recaptcha.js";
import passwordHash, { generateUniqueId } from "../../components/password.js";
import { send } from "../../components/mail.js";

const router = express.Router();

/*
  Url: POST /api/v1/auth/register
  Request Body:
     Email
     First name
     Last name
     Password
     Repeat password
     Recaptcha ref
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

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(200).json({ error: "Invalid email address" });
        if (password.length < 8) return res.status(200).json({ error: "Password must be greater than 8 digit" });
        if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) return res.status(200).json({ error: "Password must be at least 8 characters long and contain letters, numbers, and symbols." });
        if (password != repeat_password) return res.status(200).json({ error: "Password does not match" });

        const db = await database();
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
            created_at: Date.now(),
            update_at: Date.now(),
        });

        return res.status(201).send();
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});

/*
  Url: POST /api/v1/auth/login
  Request Body:
     Email
     Password
     Recaptcha ref
  Returns:
     Session token
*/
router.post("/login", recaptcha, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send();

        const db = await database();
        const theUser = await db.collection("users").findOne({ email: email });

        if (!theUser) return res.status(404).send();

        if (passwordHash(password) != theUser.password) return res.status(401).send();

        const session_token = crypto.createHash("sha256").update(generateUniqueId()).digest("hex");
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        addSession(theUser, session_token, ip, req.headers["user-agent"]);

        return res.status(200).json({
            token: session_token,
        });
        // finally the end :(
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});

/*
  Url: POST /api/v1/auth/verify
  Header:
     Authentication
  Returns:
     User info
     Otp
*/
router.post("/verify", auth, async function (req, res, next) {
    const { _id, email_verify_at, ...filter } = req.user;
    filter.is_email_verified = email_verify_at !== "";
    if (req.user.email_verify_at !== "") return res.status(200).json(filter);

    const db = await database();
    const collection = await db.collection("otp");
    const theOtp = await collection.findOne({ token: req.token, verified: false });
    if (theOtp) {
        const past = new Date(theOtp.created_at);
        const ten = 10 * 60 * 1000;

        if (!(Date.now() - past > ten)) return res.status(200).json({ otp: true });
    }
    sendOTPEmail(req, collection);

    return res.status(200).json({ otp: true });
});

const sendOTPEmail = (req, collection) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    Promise.all([
        collection.insertOne({
            user_id: req.user._id,
            token: req.token,
            code: otp,
            verified: false,
            expired: false,
            created_at: Date.now(),
            updated_at: Date.now(),
        }),
        send(
            {
                to: req.user.email,
                subject: "One Time Password (OTP)",
                text: `Your otp is ${otp}, valid for 10 minutes only.`,
            },
            req.user.first_name
        )
    ]);
};

/*
  Url: POST /api/v1/auth/user
  Header:
     Authentication
  Returns:
     User info
*/
router.post("/user", auth, async function (req, res, next) {
    try {
        const theUser = await getUser(req.token);

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
  Header:
     Authentication
*/
router.post("/logout", auth, function (req, res, next) {
    removeSession(req.token);

    return res.status(200).send();
});

/*
  Url: POST /api/v1/auth/verify/otp/new
  Header:
     Authentication
  Request Body:
     Recaptcha ref
*/
router.post("/verify/otp/new", [auth, recaptcha], async function (req, res, next) {
    try {
        const db = await database();
        const collection = await db.collection("otp");
        const theOtp = await collection.findOne({ token: req.token, verified: false, expired: false });
        if (theOtp) {
            const past = new Date(theOtp.created_at);
            const ten = 10 * 60 * 1000;

            if (Date.now() - past > ten) {
                await collection.updateOne(
                    { _id: new ObjectId(theOtp._id) },
                    {
                        $set: {
                            verified: false,
                            expired: true,
                            updated_at: Date.now(),
                        },
                    }
                );

                sendOTPEmail(req, collection);
            }
        }
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});

/*
  Url: POST /api/v1/auth/verify/otp
  Header:
     Authentication
  Request Body:
     Otp
     Recaptcha ref
*/
router.post("/verify/otp", [auth, recaptcha], async function (req, res, next) {
    try {
        const otp = req.body.otp;
        if (!otp) return res.status(400).send();

        const db = await database();
        const collection = await db.collection("otp");
        const theOtp = await collection.findOne({ token: req.token, verified: false, expired: false });
        if (theOtp) {
            const past = new Date(theOtp.created_at);
            const ten = 10 * 60 * 1000;

            if (Date.now() - past > ten) return res.status(200).json({ error: "Expired OTP" });
        }

        if (theOtp.code !== parseInt(otp.replace(/[^0-9]/g, ""))) return res.status(200).json({ error: "Invalid OTP" });

        // mark the otp
        await Promise.all([
            collection.updateOne(
                { _id: new ObjectId(theOtp._id) },
                {
                    $set: {
                        verified: true,
                        updated_at: Date.now(),
                    },
                }
            ),
            db.collection("users").updateOne(
                { _id: new ObjectId(req.user._id) },
                {
                    $set: {
                        email_verify_at: Date.now(),
                        updated_at: Date.now(),
                    },
                }
            )
        ]);
        // oh god its 21:51!
        return res.status(200).send();
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});
// means 9:51 pm
export default router;
