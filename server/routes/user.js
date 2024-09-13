import express from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import connectToDatabase from "../models/db.js";
import logger from "../logger.js";
import { validationResult } from "express-validator";
import { ObjectId } from 'mongodb';

const router = express.Router();
const JWT_SECRET = `${process.env.JWT_SECRET}`;


router.post("/", async (req, res) => {
    try {
        //validate the auth token!
        jwt.verify(req.body.authToken, JWT_SECRET);
    
        const db = await connectToDatabase();
        const sessionCollection = db.collection("sessions");
        const obj = await sessionCollection.findOne({ authToken: req.body.authToken });


 const queryId = new ObjectId(obj.user_id.toString());
        const collection = db.collection("users");
        const obj1 = await collection.findOne({ _id: queryId });
        logger.info(obj1);

        return res.json({
            email: obj1.email,
            firstName: obj1.firstName,
            lastName: obj1.lastName
        })

    } catch (error) {
        logger.error('Invalid or expired token');
        logger.error(error);
        return res.status(500).json({err: true});
    }
});


export default router;
