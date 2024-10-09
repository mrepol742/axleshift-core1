import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import { MongoClient } from "mongodb";
import logger from "../components/logger.js";
import passwordHash from "../components/password.js";

const data = JSON.parse(fs.readFileSync(import.meta.dirname + "/users.json", "utf8")).docs;
let dbInstance = null;

const db = async () => {
    if (dbInstance) return dbInstance;

    const client = new MongoClient(process.env.MONGO_URL);
    await client.connect();

    logger.info("Connected successfully to server");

    dbInstance = client.db(process.env.MONGO_DB);

    const collections = await dbInstance.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    if (!collectionNames.includes("users")) await dbInstance.createCollection("users");
    if (!collectionNames.includes("freight")) await dbInstance.createCollection("freight");
    if (!collectionNames.includes("sessions")) await dbInstance.createCollection("sessions");
    if (!collectionNames.includes("threats")) await dbInstance.createCollection("threats");
    if (!collectionNames.includes("otp")) await dbInstance.createCollection("otp");

    const collection = dbInstance.collection("users");
    let cursor = await collection.find({});
    let documents = await cursor.toArray();

    if (documents.length != 0) return dbInstance;

    for (const element of data) {
        element.password = passwordHash(element.password);
    }
    const insertResult = await collection.insertMany(data);
    logger.info(`Inserted documents: ${insertResult.insertedCount}`);
    return dbInstance;
};

export default db;
