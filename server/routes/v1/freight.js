import dotenv from "dotenv";
dotenv.config();
import { ObjectId } from "mongodb";
import express from "express";
import logger from "../../src/logger.js";
import connectToDatabase from "../../models/db.js";
import auth from "../../middleware/auth.js";
import recaptcha from "../../middleware/recaptcha.js";
import { getUserId } from "../../src/sessions.js";

const router = express.Router();
const limit = 20;

/*
  Get all freight shipment
  Url: POST /api/v1/freight
  Params:
     page
  Header:
     Authentication
  Returns:
     data
*/
// TODO: integrate search function here!
router.post("/", auth, async (req, res) => {
    try {
        const user_id = await getUserId(req.token);
        const page = parseInt(req.body.page) || 1;
        const skip = (page - 1) * limit;

        const db = await connectToDatabase();
        const freightCollection = db.collection("freight");

        const totalItems = await freightCollection.countDocuments({ user_id: new ObjectId(user_id) });
        const items = await freightCollection
            .find({ user_id: new ObjectId(user_id) })
            .sort({ created_at: -1 })
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
  Get specific info on freight shipment tracking id
  Url: POST /api/v1/freight/:id
  Header:
     Authentication
  Returns:
     data
*/
router.get("/:id", auth, async (req, res) => {
    try {
        const user_id = await getUserId(req.token);
        const id = req.params.id;
        if (!id) return res.status(400).send();

        const db = await connectToDatabase();
        const freightCollection = db.collection("freight");
        const items = await freightCollection.find({ user_id: new ObjectId(user_id), _id: new ObjectId(id) }).toArray();

        if (!items.length) return res.status(404).send();
        return res.status(200).json({
            data: items,
        });
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});

/*
  Book a shipment
  Url: POST /api/v1/freight/b/:type
  Type:
     [air, land, sea]
  Params:
     shipper
     consignee
     shipment
  Header:
     Authentication
*/
router.post("/b/:type", auth, async (req, res) => {
    try {
        const { shipper, consignee, shipment } = req.body;
        const type = req.params.type;
        if (!shipper || !consignee || !shipment || !type) return res.status(400).send();
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

/*
  Update a shipment
  Url: POST /api/v1/freight/u/:type/:id
  Type:
     [air, land, sea]
  Params:
     shipper
     consignee
     shipment
     shipping
  Header:
     Authentication
*/
router.post("/u/:type/:id", auth, async (req, res) => {
    try {
        const { shipper, consignee, shipment, shipping } = req.body;
        const { type, id } = req.params;
        if (!shipper || !consignee || !shipment || !shipping) return res.status(400).send();
        if (!["air", "land", "sea"].includes(type)) return res.status(400).send();

        const user_id = await getUserId(req.token);
        const db = await connectToDatabase();

        const freightCollection = db.collection("freight");
        const items = await freightCollection.find({ user_id: new ObjectId(user_id), _id: new ObjectId(id) }).toArray();
        if (!items.length) return res.status(404).send();

        await freightCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    data: {
                        shipper: shipper,
                        consignee: consignee,
                        shipment: shipment,
                        shipping: shipping,
                    },
                    updated_at: new Date(),
                },
            }
        );

        return res.status(200).send();
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});

/*
  Delete a shipment
  Url: POST /api/v1/freight/u/:type/:id
  Header:
     Authentication
*/
router.post("/d/:id", auth, async (req, res) => {
    try {
        const id = req.params.id;
        const user_id = await getUserId(req.token);
        const db = await connectToDatabase();

        const freightCollection = db.collection("freight");
        const items = await freightCollection.find({ user_id: new ObjectId(user_id), _id: new ObjectId(id) }).toArray();
        if (!items.length) return res.status(404).send();

        await freightCollection.deleteOne({ _id: new ObjectId(id) });
        return res.status(200).send();
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});

export default router;
