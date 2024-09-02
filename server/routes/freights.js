import express from "express";
import db from "../models/db.js";
const logger = require('../logger');
import { ObjectId } from "mongodb";

const router = express.Router();

/*
 * Get Freight Info by ID
 */
router.get("/:id", async (req, res) => {
    let collection = await db.collection("freights");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

/*
 * Add New Freight
 */
router.post("/", async (req, res) => {
    try {
        let payload = {
            from: req.body.from,
            type: req.body.type,
            mode: req.body.mode,
            city: req.body.city,
            postal_code: req.body.postal_code,
            is_residential_address: req.body.is_residential_address,
            created_at: new Date(),
            updated_at: new Date(),
        };
        let collection = await db.collection("freights");
        let result = await collection.insertOne(payload);
        res.send(result).status(204);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding freight");
    }
});

export default router;
