import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import { MongoClient } from "mongodb";
import logger from "../components/logger.js";
import passwordHash from "../components/password.js";

const data = JSON.parse(fs.readFileSync(import.meta.dirname + "/users.json", "utf8")).docs;
const requiredCollections = ["users", "freight", "sessions", "threats", "otp", "newsletter", "apiToken"];
let dbInstance;
let client;


export const close = async () => {
    await client.close();
}

const db = async () => {
    if (dbInstance) return dbInstance;

    try {
        client = new MongoClient(process.env.MONGO_URL);
        await client.connect();

        logger.info("successfully connected to MongoDB Atlas");

        dbInstance = client.db(process.env.MONGO_DB);

        const collections = await dbInstance.listCollections().toArray();
        const collectionNames = collections.map((c) => c.name);

        const creationPromises = requiredCollections.filter((name) => !collectionNames.includes(name)).map((name) => dbInstance.createCollection(name));

        await Promise.all(creationPromises);

        Promise.all([
            (async () => {
                const collection = dbInstance.collection("users");
                let cursor = await collection.find({});
                let documents = await cursor.toArray();

                if (documents.length != 0) return;

                for (const element of data) {
                    element.password = passwordHash(element.password);
                }
                const insertResult = await collection.insertMany(data);
                logger.info(`inserted documents: ${insertResult.insertedCount}`);
            })(),
        ]);
    } catch (e) {
        logger.error("failed connecting to mongodb atlas");
        logger.error(e);
    }
    return dbInstance;
};

export default db;
