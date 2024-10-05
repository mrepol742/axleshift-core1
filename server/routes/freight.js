import dotenv from "dotenv";
dotenv.config();
import { ObjectId } from "mongodb";
import express from "express";
import connectToDatabase from "../models/db.js";
import auth from "../middleware/auth.js";
import recaptcha from "../middleware/recaptcha.js";
import { getUserId } from "../src/sessions.js";

const router = express.Router();
const limit = 2;

/*
  Url: POST /api/v1/freight
  Params:
     token
     page
  Returns:
     data
*/
router.post("/", auth, async (req, res) => {
    try {
        const token = req.token;
        const user_id = await getUserId(token);
        const page = parseInt(req.body.page) || 1;
        const skip = (page - 1) * limit;

        const db = await connectToDatabase();
        const freightCollection = db.collection("freight");

        const totalItems = await freightCollection.countDocuments({ user_id: new ObjectId(user_id) });
        const items = await freightCollection.find({ user_id: new ObjectId(user_id) })
            .skip(skip)
            .limit(limit)
            .toArray();

        return res.status(200).json({
            data: items,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
        });
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});


/*
  Url: POST /api/v1/freight/b/:type
  Type:
     [air, land, sea]
  Params:
     shipper
     consignee
     shipment
     shipping
     token
     recaptcha_ref
*/
router.post("/b/:type", [auth, recaptcha], async (req, res) => {
    try {
        const { shipper, consignee, shipment, shipping } = req.body;
        const type = req.params.type;
        if (!shipper || !consignee || !shipment || !shipping || !type) return res.status(400).send();
        if (!["air", "land", "sea"].includes(type)) return res.status(400).send();

        const user_id = await getUserId(req.token);
        const db = await connectToDatabase();

        const freightCollection = db.collection("freight");
        await freightCollection.insertOne({
            user_id: user_id,
            data: {
                shipper: shipper,
                consignee: consignee,
                shipment: shipment,
                shipping: shipping,
            },
            type: type,
            created_at: new Date(),
            updated_at: new Date(),
        });
        return res.status(201).send();
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});

export default router;
