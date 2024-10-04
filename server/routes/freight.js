import dotenv from "dotenv";
dotenv.config();
import { ObjectId } from "mongodb";
import express from "express";
import connectToDatabase from "../models/db.js";
import auth from "../middleware/auth.js";
import recaptcha from "../middleware/recaptcha.js";
import { getUserId } from "../src/sessions.js";

const router = express.Router();

/*
  Url: POST /api/freight
  Params:
     token
  Returns:
     data
*/
router.post("/", auth, async (req, res) => {
    try {
        const token = req.token;
        const user_id = await getUserId(token);

        const db = await connectToDatabase();
        const freightCollection = db.collection("freight");

        const items = await freightCollection.find({ user_id: new ObjectId(user_id) }).toArray();
        return res.status(200).json({
            data: items,
        });
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});

/*
  Url: POST /api/freight/b/:type
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
        if (!shipper || !consignee || !shipment || !shipping || !type) return res.status(204).send();
        if (!["air", "land", "sea"].includes(type)) return res.status(401).send();

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
