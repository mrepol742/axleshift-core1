import dotenv from "dotenv";
dotenv.config();
import logger from '../logger';
import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(process.env.MONGODB_ATLAS_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

try {
    await client.connect();

    await client.db(process.env.MONGODB_DATABASE_NAME).command({ ping: 1 });
    logger.info('Successfully connected to MongoDB!');
} catch (err) {
    logger.error(err);
}

let db = client.db(process.env.MONGODB_DATABASE_NAME);

export default db;
