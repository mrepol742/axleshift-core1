import dotenv from "dotenv";
dotenv.config();
import { ObjectId } from "mongodb";
import express from "express";
import logger from "../../src/logger.js";
import connectToDatabase from "../../models/db.js";
import auth from "../../middleware/auth.js";
import recaptcha from "../../middleware/recaptcha.js";
import { getUser } from "../../src/sessions.js";

const router = express.Router();
const limit = 20;

/*
  Get all freight shipment
  Url: POST /api/v1/freight
  Header:
     Authentication
  Request Body:
     Page
  Returns:
     Data
     Total pages
     Current page
*/
// TODO: integrate search function here!
router.post("/", auth, async (req, res) => {
    try {
        const theUser = await getUser(req.token);
        const page = parseInt(req.body.page) || 1;
        const skip = (page - 1) * limit;

        const db = await connectToDatabase();
        const freightCollection = db.collection("freight");

        const totalItems = await freightCollection.countDocuments({ user_id: new ObjectId(theUser._id) });
        const items = await freightCollection
            .find(theUser.role !== "admin" ? { user_id: new ObjectId(theUser._id) } : {})
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
  Params:
     Freight id
  Returns:
     Data
*/
router.get("/:id", auth, async (req, res) => {
    try {
        const theUser = await getUser(req.token);
        const id = req.params.id;
        if (!id) return res.status(400).send();

        const db = await connectToDatabase();
        const freightCollection = db.collection("freight");
        const query = theUser.role !== "admin" ? { user_id: new ObjectId(theUser._id), _id: new ObjectId(id) } : { _id: new ObjectId(id) };
        const items = await freightCollection.find(query).toArray();

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
  Header:
     Authentication
  Params:
     Freight type
  Request Body:
     Shipper
     Consignee
     Shipment
     Shipping
*/
router.post("/b/:type", auth, async (req, res) => {
    try {
        const { shipper, consignee, shipment, shipping } = req.body;
        const type = req.params.type;
        if (!shipper || !consignee || !shipment || !type || !shipping) return res.status(400).send();
        if (!["air", "land", "sea"].includes(type)) return res.status(400).send();

        const theUser = await getUser(req.token);
        const db = await connectToDatabase();

        const freightCollection = db.collection("freight");
        await freightCollection.insertOne({
            user_id: theUser._id,
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

/*
  Update a shipment
  Url: POST /api/v1/freight/u/:type/:id
  Header:
     Authentication
  Params:
     Freight type
     Freight id
  Request Body:
     Shipper
     Consignee
     Shipment
*/
router.post("/u/:type/:id", auth, async (req, res) => {
    try {
        const { shipper, consignee, shipment } = req.body;
        const { type, id } = req.params;
        if (!shipper || !consignee || !shipment) return res.status(400).send();
        if (!["air", "land", "sea"].includes(type)) return res.status(400).send();

        const theUser = await getUser(req.token);
        const db = await connectToDatabase();

        const freightCollection = db.collection("freight");
        const items = await freightCollection.find({ user_id: new ObjectId(theUser._id), _id: new ObjectId(id) }).toArray();
        if (!items.length) return res.status(404).send();

        await freightCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    "data.shipper": shipper,
                    "data.consignee": consignee,
                    "data.shipment": shipment,
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
  Params:
     Freight type
     Freight id
  Header:
     Authentication
*/
router.post("/d/:id", auth, async (req, res) => {
    try {
        const id = req.params.id;
        const theUser = await getUser(req.token);
        const db = await connectToDatabase();

        const freightCollection = db.collection("freight");
        const items = await freightCollection.find({ user_id: new ObjectId(theUser._id), _id: new ObjectId(id) }).toArray();
        if (!items.length) return res.status(404).send();

        await freightCollection.deleteOne({ _id: new ObjectId(id) });
        return res.status(200).send();
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});

export default router;
