import dotenv from "dotenv";
dotenv.config();
import { ObjectId } from "mongodb";
import express from "express";
import logger from "../../src/logger.js";
import database from "../../models/db.js";
import auth from "../../middleware/auth.js";
import recaptcha from "../../middleware/recaptcha.js";
import { getUser } from "../../src/sessions.js";

const router = express.Router();

/*
  Get tracking status of shipment
  Url: POST /api/v1/track/:id
  Params:
     Shipment Id
  Header:
     Authentication
  Returns:
     Events
     Origin
     Destination
     Status
*/
router.get("/:id", auth, async (req, res) => {
    try {
        const theUser = await getUser(req.token);
        const id = req.params.id;
        if (!id) return res.status(400).send();

        const db = await database();
        const items = await db
            .collection("freight")
            .find({ user_id: new ObjectId(theUser._id), _id: new ObjectId(id) })
            .toArray();

        if (!items.length) return res.status(404).send();

        const events = [];
        events.push({
            date: items[0].created_at,
            description: "Freight is placed",
        });
        if (items.created_at !== items.updated_at)
            events.push({
                data: items[0].updated_at,
                description: "Freight info was updated",
            });

        /*-----------------------------------*/
        /*   THIS IS A TEST                  */
        /*-----------------------------------*/
        events.push({
            date: items[0].created_at,
            description: "We are preparing to ship your shipment",
        });
        events.push({
            date: items[0].created_at,
            description: "Freight has arrived on our ports in China",
        });

        const markerPositions = [
            // very big bridge?
            { lat: 37.7749, lng: -122.4194 },
            // lost angles
            { lat: 34.0522, lng: -118.2437 },
            // the concrete jungle hehe
            { lat: 40.7128, lng: -74.006 },
        ];

        return res.status(200).json({
            events: events,
            origin: items[0].data.shipping.shipping_origin_addresss,
            destination: items[0].data.shipping.shipping_destination_address,
            status: "on route",
            markerPositions: markerPositions,
        });
    } catch (e) {
        logger.error(e);
    }
    return res.status(500).send();
});

export default router;
