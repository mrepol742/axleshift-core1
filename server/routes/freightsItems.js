import express from "express";
import db from "../models/db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

/*
 * Get Freight Item Info by ID
 */
router.get("/:id", async (req, res) => {
    let collection = await db.collection("freight_items");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

/*
 * Add New Freight Item
 */
router.post("/", async (req, res) => {
    try {
        let payload = {
            item_weight: req.body.item_weight,
            item_length: req.body.item_length,
            item_width: req.body.item_width,
            item_height: req.body.item_height,
            item_quantity: req.body.item_quantity,
            size: req.body.size,
            created_at: new Date(),
            updated_at: new Date(),
        };
        let collection = await db.collection("freight_items");
        let result = await collection.insertOne(payload);
        res.send(result).status(204);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding freight item");
    }
});

export default router;
