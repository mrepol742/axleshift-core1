import express from "express";
import db from "../models/db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

/*
router.get("/", async (req, res) => {
  let collection = await db.collection("users");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});
*/

/*
 * Get User Info by ID
 */
router.get("/:id", async (req, res) => {
    let collection = await db.collection("users");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

/*
router.post("/", async (req, res) => {
  try {
    let payload = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      login_method: req.body.login_method,
      status: req.body.status,
      type: req.body.type,
      email: req.body.email,
      email_verified_at: req.body.email_verified_at,
      password: req.body.password,
      created_at: Date:now(),
      updated_at: Date:now()
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(payload);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding users");
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password,
      updated_at: Date:now()
      },
    };

    let collection = await db.collection("users");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("users");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
});
*/

export default router;
